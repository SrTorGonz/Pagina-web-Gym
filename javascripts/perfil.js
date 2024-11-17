document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const telefonoInput = document.getElementById("telefono");
    const passwordInput = document.getElementById("password");
    const guardarButton = document.querySelector("button[type='submit']");
    const nameElement = document.getElementById("name"); // Obtener el elemento h2 con id="name"

    // Cargar datos del perfil
    fetch("obtener_perfil.php")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Cargar los datos en los inputs
                emailInput.placeholder = data.data.correo;
                telefonoInput.placeholder = data.data.telefono;

                // Mostrar el nombre del usuario en el h2
                nameElement.textContent = data.data.nombre; // Asumiendo que el nombre está en 'data.data.nombre'
            } else {
                alert("Error al cargar el perfil: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudieron cargar los datos del perfil.");
        });

    // Función para manejar el clic en el botón guardar
    guardarButton.addEventListener("click", function (event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        const email = emailInput.value.trim();
        const telefono = telefonoInput.value.trim();
        const password = passwordInput.value.trim();

        // Verificar si todos los campos están vacíos
        if (!email && !telefono && !password) {
            alert("No hay datos para actualizar.");
            return; // Salir de la función para evitar el envío de datos vacíos
        }

        // Preparar los datos para enviar
        const datos = {};
        if (email) datos.correo = email;
        if (telefono) datos.telefono = telefono;
        if (password) datos.contrasena = password;

        // Enviar los datos mediante fetch
        fetch("actualizar_perfil.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Perfil actualizado correctamente.");
            } else {
                alert("Error al actualizar el perfil: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Hubo un error al actualizar el perfil.");
        });
    });
});

