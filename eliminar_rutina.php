<?php
include 'conexion.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Obtener los datos enviados
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_rutina'])) {
    echo json_encode(['error' => 'ID de rutina no proporcionado']);
    exit;
}

$id_rutina = intval($data['id_rutina']);

// Eliminar la rutina de la tabla
$sql = "DELETE FROM Rutinas WHERE id_rutina = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_rutina);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Rutina eliminada con éxito']);
} else {
    echo json_encode(['error' => 'Error al eliminar la rutina']);
}

$stmt->close();
$conn->close();
