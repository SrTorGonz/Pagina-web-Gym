<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php';

// Leer el JSON recibido
$data = json_decode(file_get_contents("php://input"), true);

// Validar los datos
$id_rutina = isset($data['id_rutina']) ? intval($data['id_rutina']) : 0;
$nombre = isset($data['nombre']) ? trim($data['nombre']) : "";

if ($id_rutina === 0 || $nombre === "") {
    echo json_encode(["error" => "Faltan datos necesarios"]);
    exit;
}

// Actualizar el nombre de la rutina
$sql = "UPDATE Rutinas SET nombre = ? WHERE id_rutina = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $nombre, $id_rutina);

if ($stmt->execute()) {
    echo json_encode(["success" => "Nombre actualizado correctamente"]);
} else {
    echo json_encode(["error" => "Error al actualizar el nombre"]);
}

$conn->close();
?>
