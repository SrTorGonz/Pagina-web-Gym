<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit;
}

$id_usuario = $_SESSION['user_id']; // ID del usuario con sesión activa
$id_ejercicio = isset($_GET['id_ejercicio']) ? intval($_GET['id_ejercicio']) : null;

if (!$id_ejercicio) {
    echo json_encode(['success' => false, 'message' => 'ID del ejercicio no proporcionado']);
    exit;
}

try {
    // Consulta para obtener el primer peso y la fecha por entrenamiento del usuario
    $sql = "
        SELECT MIN(ed.peso) AS peso, e.fecha
        FROM Entrenamiento_Detalle ed
        JOIN Entrenamientos e ON ed.id_entrenamiento = e.id_entrenamiento
        JOIN Rutinas r ON e.id_rutina = r.id_rutina
        WHERE ed.id_ejercicio = ? AND r.id_usuario = ?
        GROUP BY e.fecha
        ORDER BY e.fecha ASC
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $id_ejercicio, $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'peso' => (float)$row['peso'],
            'fecha' => $row['fecha']
        ];
    }

    echo json_encode(['success' => true, 'data' => $data]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
