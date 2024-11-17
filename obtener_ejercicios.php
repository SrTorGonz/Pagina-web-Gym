<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php';

// Validar y asignar los parámetros GET
// Verifica si el usuario está autenticado
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Usuario no autenticado']);
    exit;
}

$id_usuario = $_SESSION['user_id']; // Obteniendo el ID del usuario autenticado

$id_rutina = isset($_GET['id_rutina']) ? intval($_GET['id_rutina']) : 0;


// Consulta SQL ajustada para asegurar que todos los ejercicios se incluyan
$sql = "
    SELECT 
        e.id_ejercicio, 
        e.nombre, 
        e.nivel, 
        e.grupo_muscular, 
        e.descripcion, 
        e.imagen_inicial, 
        e.imagen_final,
        re.id_rutina 
    FROM Ejercicios e
    LEFT JOIN Rutina_Ejercicio re 
        ON e.id_ejercicio = re.id_ejercicio 
        AND re.id_rutina = ?
";

// Preparar la consulta y ejecutar
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_rutina);
$stmt->execute();
$result = $stmt->get_result();

$ejercicios = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $ejercicios[] = [
            'id_ejercicio' => $row['id_ejercicio'],
            'nombre' => $row['nombre'],
            'nivel' => $row['nivel'],
            'grupo_muscular' => $row['grupo_muscular'],
            'descripcion' => $row['descripcion'],
            'imagenes' => [
                'inicial' => $row['imagen_inicial'],
                'final' => $row['imagen_final']
            ],
            'id_rutina' => $row['id_rutina'] // Será NULL si no está en la rutina
        ];
    }
}

// Configura el encabezado para devolver JSON
header('Content-Type: application/json');

// Imprime el JSON o un mensaje de error si no hay datos
echo json_encode($ejercicios);

$conn->close();
?>