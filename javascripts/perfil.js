document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const telefonoInput = document.getElementById("telefono");
    const passwordInput = document.getElementById("password");
    const guardarButton = document.querySelector("button[type='submit']");
    const nameElement = document.getElementById("name");

    // Cargar datos del perfil
    fetch("obtener_perfil.php")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                emailInput.placeholder = data.data.correo;
                telefonoInput.placeholder = data.data.telefono;
                nameElement.textContent = data.data.nombre;
            } else {
                alert("Error al cargar el perfil: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudieron cargar los datos del perfil.");
        });

    // Validación de correo electrónico
    function validarCorreo(correo) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Patrón para validar correos
        return regex.test(correo);
    }

    // Función para manejar el clic en el botón guardar
    guardarButton.addEventListener("click", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const telefono = telefonoInput.value.trim();
        const password = passwordInput.value.trim();

        // Validar el correo si se ingresó
        if (email && !validarCorreo(email)) {
            alert("El correo ingresado no es válido. Por favor, verifica e intenta nuevamente.");
            return; // No continuar si el correo no es válido
        }

        // Verificar si todos los campos están vacíos
        if (!email && !telefono && !password) {
            alert("No hay datos para actualizar.");
            return;
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

    const cerrarButton = document.getElementById("cerrar");
    cerrarButton.addEventListener("click", function () {
        fetch("cerrar_sesion.php")
            .then(response => response.json())
            .then(data => {
                if (data.success && data.redirect) {
                    window.location.href = data.redirect;
                } else {
                    alert("Hubo un problema al cerrar sesión.");
                }
            })
            .catch(error => {
                console.error("Error al cerrar sesión:", error);
                alert("Hubo un error al cerrar sesión.");
            });
    });
});
