<?php
include 'conexion.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['fechas']) || empty($data['fechas'])) {
    echo json_encode(['error' => 'No se proporcionaron fechas']);
    exit;
}

$user_id = $_SESSION['user_id']; // ID del usuario autenticado
$fechas = $data['fechas'];

// Preparar placeholders para las fechas
$placeholders = implode(",", array_fill(0, count($fechas), "?"));

// Consulta SQL para obtener entrenamientos y nombres de rutinas del usuario
$sql = "
    SELECT Entrenamientos.fecha, Rutinas.nombre AS rutina
    FROM Entrenamientos
    INNER JOIN Rutinas ON Entrenamientos.id_rutina = Rutinas.id_rutina
    WHERE Entrenamientos.fecha IN ($placeholders)
    AND Rutinas.id_usuario = ?
";

// Preparar la declaración
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'Error al preparar la consulta']);
    exit;
}

// Construir parámetros para bind_param
$params = array_merge($fechas, [$user_id]);
$types = str_repeat("s", count($fechas)) . "i"; // Tipos de datos: 's' para fechas, 'i' para el ID del usuario
$stmt->bind_param($types, ...$params);

// Ejecutar la consulta
$stmt->execute();
$result = $stmt->get_result();

$entrenamientos = [];

// Recorrer los resultados y almacenarlos en un arreglo
while ($row = $result->fetch_assoc()) {
    $entrenamientos[] = [
        'fecha' => $row['fecha'],
        'rutina' => $row['rutina'] ?? 'Sin registro' // Si no hay nombre, colocar "Sin registro"
    ];
}

// Retornar los resultados como JSON
header('Content-Type: application/json');
echo json_encode($entrenamientos);

$stmt->close();
$conn->close();