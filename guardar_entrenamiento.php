<?php
include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_rutina'], $data['fecha'], $data['detalles'])) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

$id_rutina = intval($data['id_rutina']);
$fecha = $data['fecha'];

// Verificar si ya existe un entrenamiento en la fecha seleccionada para la rutina
$sql_verificar = "SELECT id_entrenamiento FROM Entrenamientos WHERE id_rutina = ? AND fecha = ?";
$stmt_verificar = $conn->prepare($sql_verificar);
$stmt_verificar->bind_param("is", $id_rutina, $fecha);
$stmt_verificar->execute();
$result = $stmt_verificar->get_result();

if ($result->num_rows > 0) {
    // Ya existe un entrenamiento
    $entrenamiento_existente = $result->fetch_assoc();
    echo json_encode([
        'success' => false,
        'error' => 'Ya existe un entrenamiento para esta fecha.',
        'entrenamiento_id' => $entrenamiento_existente['id_entrenamiento']
    ]);
    exit;
}

// Insertar el entrenamiento (si no existe)
$sql_insertar_entrenamiento = "INSERT INTO Entrenamientos (id_rutina, fecha) VALUES (?, ?)";
$stmt_insertar = $conn->prepare($sql_insertar_entrenamiento);
$stmt_insertar->bind_param("is", $id_rutina, $fecha);

if ($stmt_insertar->execute()) {
    $id_entrenamiento = $stmt_insertar->insert_id;

    // Insertar los detalles del entrenamiento
    $sql_insertar_detalle = "INSERT INTO Entrenamiento_Detalle (id_entrenamiento, id_ejercicio, peso, serie, repeticiones) VALUES (?, ?, ?, ?, ?)";
    $stmt_detalle = $conn->prepare($sql_insertar_detalle);

    foreach ($data['detalles'] as $detalle) {
        $id_ejercicio = intval($detalle['id_ejercicio']);
        $peso = floatval($detalle['peso']);
        $serie = intval($detalle['serie']);
        $repeticiones = intval($detalle['repeticiones']);

        $stmt_detalle->bind_param("iidii", $id_entrenamiento, $id_ejercicio, $peso, $serie, $repeticiones);
        $stmt_detalle->execute();
    }

    echo json_encode(['success' => true, 'message' => 'Entrenamiento guardado con éxito.']);
} else {
    echo json_encode(['success' => false, 'error' => 'Error al guardar el entrenamiento.']);
}

$conn->close();
?>

