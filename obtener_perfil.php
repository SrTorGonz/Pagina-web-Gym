<?php
session_start();
require 'conexion.php';
header("Content-Type: application/json");

if (!isset($_SESSION['user_email'])) {
    echo json_encode(["success" => false, "message" => "No se ha iniciado sesión."]);
    exit;
}

$email = $_SESSION['user_email'];

try {
    $sql = "SELECT correo, telefono, nombre FROM Usuarios WHERE correo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        echo json_encode(["success" => true, "data" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado."]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error del servidor: " . $e->getMessage()]);
}
?>
