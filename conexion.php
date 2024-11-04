<?php
// Configuración de la base de datos
$servername = "sql300.infinityfree.com";
$username = "if0_37646599";
$password = "3QoqZn18fSWeMB";
$database = "if0_37646599_GyFitnessPlus";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

echo "Conectado correctamente";

?>