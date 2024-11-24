<?php
session_start(); // Iniciar la sesión
session_unset(); // Eliminar todas las variables de sesión
session_destroy(); // Destruir la sesión

// Devolver una respuesta JSON para notificar al cliente
header('Content-Type: application/json');
echo json_encode(['success' => true, 'redirect' => 'index.html']);
exit();
?>

