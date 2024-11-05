<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conexion.php';

$sql = "SELECT id_ejercicio, nombre, nivel, grupo_muscular, descripcion, imagen_inicial, imagen_final FROM Ejercicios";
$result = $conn->query($sql);

$ejercicios = [];

if ($result->num_rows > 0) {
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
            ]
        ];
    }
}

// Configura el encabezado para devolver JSON
header('Content-Type: application/json');

// Imprime el JSON o un array vacío
echo json_encode($ejercicios);

$conn->close();
?>