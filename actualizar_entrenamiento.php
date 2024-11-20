<?php
include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_entrenamiento'], $data['detalles'])) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

$id_entrenamiento = intval($data['id_entrenamiento']);

// Eliminar los registros existentes del entrenamiento
$sql_eliminar = "DELETE FROM Entrenamiento_Detalle WHERE id_entrenamiento = ?";
$stmt_eliminar = $conn->prepare($sql_eliminar);
$stmt_eliminar->bind_param("i", $id_entrenamiento);
$stmt_eliminar->execute();

// Insertar los nuevos detalles del entrenamiento
$sql_insertar = "INSERT INTO Entrenamiento_Detalle (id_entrenamiento, id_ejercicio, peso, serie, repeticiones) VALUES (?, ?, ?, ?, ?)";
$stmt_insertar = $conn->prepare($sql_insertar);

foreach ($data['detalles'] as $detalle) {
    $id_ejercicio = intval($detalle['id_ejercicio']);
    $peso = floatval($detalle['peso']);
    $serie = intval($detalle['serie']);
    $repeticiones = intval($detalle['repeticiones']);

    $stmt_insertar->bind_param("iidii", $id_entrenamiento, $id_ejercicio, $peso, $serie, $repeticiones);
    $stmt_insertar->execute();
}

echo json_encode(['success' => true, 'message' => 'Entrenamiento actualizado con éxito.']);
$conn->close();
?>
