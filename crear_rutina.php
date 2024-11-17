<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php';

// Simula el ID del usuario con sesión iniciada (reemplaza con tu lógica de sesión)
$id_usuario = 1; // Aquí deberías usar el ID del usuario con sesión iniciada

// Verifica si se envió un nombre (aunque usaremos un valor por defecto)
$data = json_decode(file_get_contents("php://input"), true);
$nombre = isset($data['nombre']) ? $data['nombre'] : "Mi Rutina";

if (!$id_usuario) {
    echo json_encode(["error" => "Usuario no autenticado"]);
    exit;
}

// Inserta la nueva rutina
$sql = "INSERT INTO Rutinas (id_usuario, nombre) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $id_usuario, $nombre);

if ($stmt->execute()) {
    $id_rutina = $stmt->insert_id; // Obtiene el ID de la rutina creada
    echo json_encode(["id_rutina" => $id_rutina]);
} else {
    echo json_encode(["error" => "No se pudo crear la rutina"]);
}

$conn->close();
?>