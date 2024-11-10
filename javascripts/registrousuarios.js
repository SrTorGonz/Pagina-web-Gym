document.addEventListener("DOMContentLoaded", function() {
    const registroButton = document.querySelector(".registro-button");
    registroButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevenir el envío por defecto

        // Obtener valores de los inputs
        const email = document.getElementById("email").value;
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;

        // Verificar que todos los campos estén llenos
        if (!email || !name || !phone || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Verificar que el email sea válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Por favor, introduce un correo electrónico válido.");
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
