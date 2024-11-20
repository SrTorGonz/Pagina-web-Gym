<?php
include 'conexion.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

if (!isset($_GET['id_rutina'])) {
    echo json_encode(['error' => 'ID de rutina no proporcionado']);
    exit;
}

$id_rutina = intval($_GET['id_rutina']);

// Consulta principal para obtener los ejercicios, total de series, repeticiones, y último peso
$sql = "
    SELECT 
        Ejercicios.id_ejercicio,
        Ejercicios.nombre,
        Ejercicios.imagen_inicial,
        Ejercicios.imagen_final,
        Rutina_Ejercicio.series AS total_series,
        Rutina_Ejercicio.repeticiones AS repeticiones_por_serie,
        (
            SELECT 
                Entrenamiento_Detalle.peso
            FROM 
                Entrenamiento_Detalle
            JOIN 
                Entrenamientos ON Entrenamiento_Detalle.id_entrenamiento = Entrenamientos.id_entrenamiento
            WHERE 
                Entrenamientos.id_rutina = Rutina_Ejercicio.id_rutina
                AND Entrenamiento_Detalle.id_ejercicio = Ejercicios.id_ejercicio
            ORDER BY 
                Entrenamientos.fecha DESC
            LIMIT 1
        ) AS ultimo_peso
    FROM 
        Rutina_Ejercicio
    JOIN 
        Ejercicios ON Rutina_Ejercicio.id_ejercicio = Ejercicios.id_ejercicio
    WHERE 
        Rutina_Ejercicio.id_rutina = ?
    GROUP BY 
        Ejercicios.id_ejercicio
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_rutina);
$stmt->execute();
$result = $stmt->get_result();

$ejercicios = [];
while ($row = $result->fetch_assoc()) {
    $detalles = [];

    // Consulta para obtener las repeticiones de cada serie desde el entrenamiento más reciente
    $detalle_query = "
        SELECT 
            Entrenamiento_Detalle.serie,
            Entrenamiento_Detalle.repeticiones
        FROM 
            Entrenamiento_Detalle
        JOIN 
            Entrenamientos ON Entrenamiento_Detalle.id_entrenamiento = Entrenamientos.id_entrenamiento
        WHERE 
            Entrenamientos.id_entrenamiento = (
                SELECT 
                    MAX(id_entrenamiento) 
                FROM 
                    Entrenamientos 
                WHERE 
                    id_rutina = ?
            )
            AND Entrenamiento_Detalle.id_ejercicio = ?
        ORDER BY 
            Entrenamiento_Detalle.serie ASC
    ";

    $detalle_stmt = $conn->prepare($detalle_query);
    $detalle_stmt->bind_param("ii", $id_rutina, $row['id_ejercicio']);
    $detalle_stmt->execute();
    $detalle_result = $detalle_stmt->get_result();

    $series_repeticiones = [];
    while ($detalle_row = $detalle_result->fetch_assoc()) {
        $series_repeticiones[$detalle_row['serie']] = $detalle_row['repeticiones'];
    }

    // Generar las filas para las series de la rutina
    for ($serie = 1; $serie <= $row['total_series']; $serie++) {
        $detalles[] = [
            'serie' => $serie,
            'ultimo_registro' => $series_repeticiones[$serie] ?? 'N/A' // Si no hay registro, mostrar 'N/A'
        ];
    }

    $ejercicios[] = [
        'id_ejercicio' => $row['id_ejercicio'],
        'nombre' => $row['nombre'],
        'imagen_inicial' => $row['imagen_inicial'],
        'imagen_final' => $row['imagen_final'],
        'total_series' => $row['total_series'],
        'repeticiones_por_serie' => $row['repeticiones_por_serie'],
        'ultimo_peso' => $row['ultimo_peso'] ?? 'N/A', // Si no hay registro, mostrar 'N/A'
        'detalles' => $detalles
    ];
}

header('Content-Type: application/json');
echo json_encode($ejercicios);

$conn->close();
