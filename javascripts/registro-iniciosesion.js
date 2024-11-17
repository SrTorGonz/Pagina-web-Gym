
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector(".iniciarsesion-button");

    loginButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto

        // Obtener valores de los inputs
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        // Verificar que los campos no estén vacíos
        if (!email || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Enviar datos al servidor usando fetch
        fetch("procesar_login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Inicio de sesión exitoso.");
                    window.location.href = "home.html"; // Redirige a home.html
                } else {
                    alert("Error en el inicio de sesión: " + data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Hubo un problema al conectar con el servidor.");
            });
    });
});

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
