function guardarCorreo() {
    // Obtener el valor del correo electrónico ingresado en el input con ID "register-email"
    const email = document.getElementById('register-email').value;

    // Redirigir a "registro.html" con el correo como parámetro en la URL
    if (email) {
        window.location.href = `registro.html?email=${encodeURIComponent(email)}`;
    } else {
        alert("Por favor, ingresa un correo electrónico.");
    }
}
