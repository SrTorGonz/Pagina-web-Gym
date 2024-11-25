<?php
include 'conexion.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['fecha'])) {
    echo json_encode(['error' => 'Fecha no proporcionada']);
    exit;
}

$fecha = $data['fecha'];
$user_id = $_SESSION['user_id'];

$sql = "
    SELECT 
        Ejercicios.nombre,
        Entrenamiento_Detalle.peso,
        Entrenamiento_Detalle.serie,
        Entrenamiento_Detalle.repeticiones
    FROM Entrenamientos
    JOIN Rutinas ON Entrenamientos.id_rutina = Rutinas.id_rutina
    JOIN Entrenamiento_Detalle ON Entrenamientos.id_entrenamiento = Entrenamiento_Detalle.id_entrenamiento
    JOIN Ejercicios ON Entrenamiento_Detalle.id_ejercicio = Ejercicios.id_ejercicio
    WHERE Entrenamientos.fecha = ? AND Rutinas.id_usuario = ?
    ORDER BY Ejercicios.id_ejercicio, Entrenamiento_Detalle.serie ASC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $fecha, $user_id);
$stmt->execute();

$result = $stmt->get_result();

$entrenamientos = [];
$maxSeries = 0;

while ($row = $result->fetch_assoc()) {
    $nombre = $row["nombre"];
    if (!isset($entrenamientos[$nombre])) {
        $entrenamientos[$nombre] = [
            "nombre" => $nombre,
            "peso" => $row["peso"],
            "series" => []
        ];
    }
    $entrenamientos[$nombre]["series"][$row["serie"]] = $row["repeticiones"];

    // Actualizar el número máximo de series
    $maxSeries = max($maxSeries, $row["serie"]);
}

echo json_encode([
    "entrenamientos" => array_values($entrenamientos),
    "maxSeries" => $maxSeries
]);

$conn->close();
?>
