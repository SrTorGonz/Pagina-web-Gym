document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const telefonoInput = document.getElementById("telefono");
    const passwordInput = document.getElementById("password");
    const guardarButton = document.querySelector("button[type='submit']");

    // Cargar datos del perfil
    fetch("obtener_perfil.php")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                emailInput.placeholder = data.data.correo;
                telefonoInput.placeholder = data.data.telefono;
            } else {
                alert("Error al cargar el perfil: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("No se pudieron cargar los datos del perfil.");
        });

    // Actualizar datos del perfil
    guardarButton.addEventListener("click", function (event) {
        event.preventDefault();

        const updatedEmail = emailInput.value || emailInput.placeholder;
        const updatedTelefono = telefonoInput.value || telefonoInput.placeholder;
        const updatedPassword = passwordInput.value;

        if (!updatedEmail || !updatedTelefono || !updatedPassword) {
            alert("Por favor completa todos los campos.");
            return;
        }

        fetch("actualizar_perfil.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: updatedEmail,
                telefono: updatedTelefono,
                password: updatedPassword
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Perfil actualizado correctamente.");
                    window.location.reload();
                } else {
                    alert("Error al actualizar el perfil: " + data.message);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("No se pudo actualizar el perfil.");
            });
    });
});
