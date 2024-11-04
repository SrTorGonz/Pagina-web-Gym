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

// Establecer el conjunto de caracteres a utf8mb4
$conn->set_charset("utf8mb4");

// Cargar y decodificar el archivo JSON
$jsonFile = 'ejercicios.json';
$jsonData = file_get_contents($jsonFile);
$ejercicios = json_decode($jsonData, true);

// Insertar cada ejercicio en la tabla
foreach ($ejercicios as $ejercicio) {
    $nombre = $conn->real_escape_string($ejercicio['nombre']);
    $nivel = $conn->real_escape_string($ejercicio['nivel']);
    $grupo_muscular = $conn->real_escape_string($ejercicio['grupo_muscular']);
    $descripcion = $conn->real_escape_string($ejercicio['descripcion']);
    $imagen_inicial = $conn->real_escape_string($ejercicio['imagenes']['inicial']);
    $imagen_final = $conn->real_escape_string($ejercicio['imagenes']['final']);

    $sql = "INSERT INTO Ejercicios (nombre, nivel, grupo_muscular, descripcion, imagen_inicial, imagen_final) 
            VALUES ('$nombre', '$nivel', '$grupo_muscular', '$descripcion', '$imagen_inicial', '$imagen_final')";

    if (!$conn->query($sql)) {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

echo "Datos insertados correctamente";
$conn->close();
?>