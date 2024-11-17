<?php

include 'conexion.php';

// Verifica si el usuario está autenticado
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

$id_usuario = $_SESSION['user_id']; // Obteniendo el ID del usuario autenticado


// Consulta para obtener las rutinas del usuario
$sql_rutinas = "SELECT id_rutina, nombre FROM Rutinas WHERE id_usuario = ?";
$stmt_rutinas = $conn->prepare($sql_rutinas);
$stmt_rutinas->bind_param("i", $id_usuario);
$stmt_rutinas->execute();
$result_rutinas = $stmt_rutinas->get_result();

$rutinas = [];
if ($result_rutinas->num_rows > 0) {
    while ($row_rutina = $result_rutinas->fetch_assoc()) {
        $id_rutina = $row_rutina['id_rutina'];
        
        // Obtén los primeros 4 ejercicios de la rutina
        $sql_ejercicios = "SELECT Ejercicios.imagen_inicial, Ejercicios.imagen_final 
                           FROM Rutina_Ejercicio 
                           JOIN Ejercicios ON Rutina_Ejercicio.id_ejercicio = Ejercicios.id_ejercicio 
                           WHERE Rutina_Ejercicio.id_rutina = ?
                           LIMIT 4";
        $stmt_ejercicios = $conn->prepare($sql_ejercicios);
        $stmt_ejercicios->bind_param("i", $id_rutina);
        $stmt_ejercicios->execute();
        $result_ejercicios = $stmt_ejercicios->get_result();
        
        $ejercicios = [];
        while ($row_ejercicio = $result_ejercicios->fetch_assoc()) {
            $ejercicios[] = [
                'imagen_inicial' => $row_ejercicio['imagen_inicial'],
                'imagen_final' => $row_ejercicio['imagen_final']
            ];
        }
        
        // Almacena la rutina con sus primeros 4 ejercicios
        $rutinas[] = [
            'id_rutina' => $id_rutina,
            'nombre' => $row_rutina['nombre'],
            'ejercicios' => $ejercicios
        ];
    }
}

header('Content-Type: application/json');
echo json_encode($rutinas);

$conn->close();
