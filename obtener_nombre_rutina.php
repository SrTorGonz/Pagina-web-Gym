<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php';

// Validar y asignar el id_rutina recibido
$id_rutina = isset($_GET['id_rutina']) ? intval($_GET['id_rutina']) : 0;

if ($id_rutina === 0) {
    echo json_encode(["error" => "Falta el parámetro id_rutina"]);
    exit;
}

// Consulta para obtener el nombre de la rutina
$sql = "SELECT nombre FROM Rutinas WHERE id_rutina = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_rutina);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $rutina = $result->fetch_assoc();
    echo json_encode(["nombre" => $rutina['nombre']]);
} else {
    echo json_encode(["error" => "Rutina no encontrada"]);
}

$conn->close();
?>