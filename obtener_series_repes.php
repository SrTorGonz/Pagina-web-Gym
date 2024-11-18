<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'conexion.php';

header("Content-Type: application/json");

$idEjercicio = isset($_GET['id_ejercicio']) ? intval($_GET['id_ejercicio']) : 0;
$idRutina = isset($_GET['id_rutina']) ? intval($_GET['id_rutina']) : 0;

if ($idEjercicio === 0 || $idRutina === 0) {
    echo json_encode(["success" => false, "message" => "Faltan datos necesarios."]);
    exit;
}

try {
    $sql = "SELECT series, repeticiones FROM Rutina_Ejercicio WHERE id_rutina = ? AND id_ejercicio = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $idRutina, $idEjercicio);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        echo json_encode(["success" => true, "series" => $data['series'], "repeticiones" => $data['repeticiones']]);
    } else {
        echo json_encode(["success" => false, "message" => "No se encontraron datos para el ejercicio."]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error en el servidor."]);
}

$conn->close();
?>
