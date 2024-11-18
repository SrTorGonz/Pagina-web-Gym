<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'conexion.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$idEjercicio = isset($data['id_ejercicio']) ? intval($data['id_ejercicio']) : 0;
$idRutina = isset($data['id_rutina']) ? intval($data['id_rutina']) : 0;

if ($idEjercicio === 0 || $idRutina === 0) {
    echo json_encode(["success" => false, "message" => "Faltan datos necesarios."]);
    exit;
}

try {
    $sql = "DELETE FROM Rutina_Ejercicio WHERE id_rutina = ? AND id_ejercicio = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $idRutina, $idEjercicio);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Ejercicio eliminado con éxito."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar el ejercicio."]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error en el servidor."]);
}

$conn->close();
?>
