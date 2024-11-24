document.addEventListener("DOMContentLoaded", function() {
    const registroButton = document.querySelector(".registro-button");

    // Definir los colores para el éxito y error
    const colorSuccess = "#83ff87"; // Verde (puedes cambiar este valor)
    const colorError = "#f66060"; // Rojo (puedes cambiar este valor)

    // Crear un contenedor para los mensajes de alerta
    const alertContainer = document.createElement("div");
    alertContainer.style.color = colorError;  // Inicialmente en rojo
    alertContainer.style.marginTop = "5px";
    alertContainer.style.textAlign = "center";
    registroButton.parentElement.appendChild(alertContainer);



    registroButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevenir el envío por defecto

        // Obtener valores de los inputs
        const email = document.getElementById("email").value;
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;

        // Limpiar mensajes previos
        alertContainer.textContent = "";

        // Verificar que todos los campos estén llenos
        if (!email || !name || !phone || !password) {
            alertContainer.textContent = "Completa todos los campos.";
            alertContainer.style.color = colorError;  // Cambiar a color rojo
            return;
        }

        // Verificar que el email sea válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {

            alertContainer.textContent = "Correo electrónico inválido.";
            alertContainer.style.color = colorError;  // Cambiar a color rojo
            return;
        }

        // Enviar datos al servidor usando fetch
        fetch("procesar_registro.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, name, phone, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Registro exitoso.");
                window.location.href = "home.html"; // Redirige a home.html
            } else {
                alert("Hubo un error en el registro: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Hubo un problema al conectar con el servidor.");
        });
    });
});
