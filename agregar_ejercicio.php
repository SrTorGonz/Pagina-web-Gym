<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php';

// Leer los datos enviados desde el cliente
$data = json_decode(file_get_contents("php://input"), true);

$id_ejercicio = isset($data['id_ejercicio']) ? intval($data['id_ejercicio']) : 0;
$id_rutina = isset($data['id_rutina']) ? intval($data['id_rutina']) : 0;
$series = isset($data['series']) ? intval($data['series']) : 0;
$repeticiones = isset($data['repeticiones']) ? intval($data['repeticiones']) : 0;

if ($id_ejercicio === 0 || $id_rutina === 0 || $series === 0 || $repeticiones === 0) {
    echo json_encode(["error" => "Faltan datos necesarios"]);
    exit;
}

// Insertar el ejercicio en la rutina
$sql = "INSERT INTO Rutina_Ejercicio (id_rutina, id_ejercicio, series, repeticiones) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iiii", $id_rutina, $id_ejercicio, $series, $repeticiones);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Ejercicio agregado con éxito"]);
} else {
    echo json_encode(["success" => false, "error" => "Error al agregar el ejercicio"]);
}

$conn->close();
?>