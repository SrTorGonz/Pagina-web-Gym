<?php
include 'conexion.php';
// Obtener el ID del usuario desde la sesión
session_start();
$id_usuario = $_SESSION['user_id']; // Asegúrate de tener el ID del usuario en la sesión

// Consultar los datos del perfil
$sql = "SELECT correo, nombre, telefono FROM Usuarios WHERE id_usuario = $id_usuario";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Recuperar el resultado y devolverlo como JSON
    $row = $result->fetch_assoc();
    echo json_encode([
        "success" => true,
        "data" => [
            "correo" => $row["correo"],
            "nombre" => $row["nombre"],
            "telefono" => $row["telefono"]
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "No se encontraron datos del perfil."
    ]);
}

$conn->close();
?>

