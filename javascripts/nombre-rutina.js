document.addEventListener("DOMContentLoaded", function () {
    const idRutina = localStorage.getItem("idRutina"); // Obtiene el id de la rutina del localStorage

    if (!idRutina) {
        console.error("No se encontró el ID de la rutina en el localStorage");
        return;
    }

    // Llama al PHP para obtener el nombre de la rutina
    fetch(`obtener_nombre_rutina.php?id_rutina=${idRutina}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener el nombre de la rutina");
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }

            // Actualiza el contenido del span con el nombre de la rutina
            const spanNombreRutina = document.querySelector(".routine-name span");
            spanNombreRutina.textContent = data.nombre;
        })
        .catch(error => console.error("Error en la solicitud:", error));
});
