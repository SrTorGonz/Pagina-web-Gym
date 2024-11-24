document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector(".iniciarsesion-button");

    // Definir los colores para el éxito y error
    const colorSuccess = "#83ff87"; // Verde (puedes cambiar este valor)
    const colorError = "#b90000"; // Rojo (puedes cambiar este valor)

    // Crear un contenedor para los mensajes de alerta
    const alertContainer = document.createElement("div");
    alertContainer.style.color = colorError;  // Inicialmente en rojo
    alertContainer.style.marginTop = "5px";
    alertContainer.style.textAlign = "center";
    loginButton.parentElement.appendChild(alertContainer);

    loginButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto

        // Obtener valores de los inputs
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        // Limpiar mensajes previos
        alertContainer.textContent = "";

        // Verificar que los campos no estén vacíos
        if (!email || !password) {
            alertContainer.textContent = "Completa todos los campos.";
            alertContainer.style.color = colorError;  // Cambiar a color rojo
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
                    alertContainer.style.color = colorSuccess;  // Cambiar a color verde
                    alertContainer.textContent = "Inicio de sesión exitoso.";
                    
                    // Redirigir a home.html después de un breve momento
                    setTimeout(() => {
                        window.location.href = "home.html"; // Redirige a home.html
                    }, 1000); // Espera 1 segundo antes de redirigir
                } else {
                    alertContainer.textContent = data.message; // Mostrar mensaje de error
                    alertContainer.style.color = colorError;  // Cambiar a color rojo
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alertContainer.textContent = "Hubo un problema al conectar con el servidor.";
                alertContainer.style.color = colorError;  // Cambiar a color rojo
            });
    });
});

function guardarCorreo() {
    // Obtener el valor del correo electrónico ingresado en el input con ID "register-email"
    const email = document.getElementById("register-email").value;

    // Seleccionar el contenedor de alerta de la sección de registro
    const alertContainer = document.getElementById("alert-container");

    // Limpiar mensajes previos
    alertContainer.textContent = "";

    // Verificar si el correo está vacío antes de redirigir
    if (!email) {
        alertContainer.textContent = "Ingresa un correo electrónico.";
        alertContainer.style.color = "#b90000"; // Rojo
        return;
    }

    // Si el correo es válido, redirigir
    window.location.href = `registro.html?email=${encodeURIComponent(email)}`;
}



