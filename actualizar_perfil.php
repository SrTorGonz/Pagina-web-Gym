<?php
session_start();
require 'conexion.php';
header("Content-Type: application/json");

if (!isset($_SESSION['user_email'])) {
    echo json_encode(["success" => false, "message" => "No se ha iniciado sesión."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $_SESSION['user_email'];
$newEmail = $data['email'] ?? null;
$telefono = $data['telefono'] ?? null;
$password = $data['password'] ?? null;

if (!$newEmail || !$telefono || !$password) {
    echo json_encode(["success" => false, "message" => "Faltan datos."]);
    exit;
}

try {
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $sql = "UPDATE Usuarios SET correo = ?, telefono = ?, contraseña = ? WHERE correo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $newEmail, $telefono, $hashedPassword, $email);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $_SESSION['user_email'] = $newEmail; // Actualizar el correo en la sesión
        echo json_encode(["success" => true, "message" => "Perfil actualizado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "No se realizaron cambios."]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error del servidor: " . $e->getMessage()]);
}
?>
