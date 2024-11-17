<?php
include 'conexion.php';


// Obtener los datos JSON enviados
$data = json_decode(file_get_contents("php://input"), true);

// Verificar que los datos estén presentes
if (isset($data['correo']) || isset($data['telefono']) || isset($data['contrasena'])) {
    // Se asume que la sesión ya está iniciada y el ID del usuario está disponible
    session_start();
    $id_usuario = $_SESSION['user_id']; // Asume que el ID del usuario está en la sesión

    // Crear una cadena SQL dinámica para actualizar solo los campos que se envíen
    $updateFields = [];
    if (isset($data['correo'])) {
        $correo = $conn->real_escape_string($data['correo']);
        $updateFields[] = "correo = '$correo'";
    }
    if (isset($data['telefono'])) {
        $telefono = $conn->real_escape_string($data['telefono']);
        $updateFields[] = "telefono = '$telefono'";
    }
    if (isset($data['contrasena'])) {
        $contrasena = password_hash($conn->real_escape_string($data['contrasena']), PASSWORD_BCRYPT);
        $updateFields[] = "contraseña = '$contrasena'";
    }

    // Si hay campos para actualizar
    if (!empty($updateFields)) {
        $updateQuery = "UPDATE Usuarios SET " . implode(", ", $updateFields) . " WHERE id_usuario = $id_usuario";
        
        if ($conn->query($updateQuery) === TRUE) {
            echo json_encode(["success" => true, "message" => "Perfil actualizado correctamente."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al actualizar el perfil: " . $conn->error]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "No se recibieron datos para actualizar."]);
    }

    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "No se enviaron datos válidos."]);
}
?>


