<?php
// Incluir la conexión a la base de datos
require 'conexion.php';

header("Content-Type: application/json");
session_start(); // Iniciar la sesión

try {
    // Leer los datos enviados en formato JSON
    $data = json_decode(file_get_contents("php://input"), true);

    // Verificar que se hayan recibido todos los campos necesarios
    if (!isset($data['email'], $data['name'], $data['phone'], $data['password'])) {
        echo json_encode(["success" => false, "message" => "Faltan datos en el formulario."]);
        exit;
    }

    $email = $data['email'];
    $name = $data['name'];
    $phone = $data['phone'];
    $password = $data['password'];

    // Validar formato del email en el servidor
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Correo electrónico no válido."]);
        exit;
    }

    // Encriptar la contraseña
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Preparar y ejecutar la inserción en la base de datos
    $sql = "INSERT INTO Usuarios (correo, nombre, telefono, contraseña) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $email, $name, $phone, $hashedPassword);

    if ($stmt->execute()) {
        // Obtener el ID del usuario recién creado
        $userId = $conn->insert_id;

        // Crear una sesión con el ID del usuario
        $_SESSION['user_id'] = $userId;

        echo json_encode([
            "success" => true,
            "message" => "Usuario registrado con éxito.",
            "user_id" => $userId
        ]);
    }
} catch (mysqli_sql_exception $e) {
    // Verificar si el error es de duplicado
    if ($e->getCode() === 1062) { // 1062 es el código de error para duplicado de clave única
        echo json_encode(["success" => false, "message" => "El correo ya está registrado."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al registrar el usuario."]);
    }
} finally {
    // Cerrar la conexión
    $stmt->close();
    $conn->close();
}
?>
