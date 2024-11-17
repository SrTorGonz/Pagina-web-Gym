document.addEventListener("DOMContentLoaded", function () {
    const spanNombreRutina = document.getElementById("routineName");
    const iconEdit = document.querySelector(".ICON");

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
     
    iconEdit.addEventListener("click", () => {
        // Crear un input con el valor actual del span
        const input = document.createElement("input");
        input.type = "text";
        input.value = spanNombreRutina.textContent;
        input.id = "routineNameInput"; // Identificador para el input
        input.className = "routine-name-input"; // Añade una clase para estilos si es necesario

        // Reemplaza el span con el input
        spanNombreRutina.replaceWith(input);

        // Enfocar automáticamente el input
        input.focus();

        // Manejar el evento de pérdida de foco (cuando el usuario hace clic fuera del input)
        input.addEventListener("blur", () => {
            const nuevoNombre = input.value.trim();

            if (nuevoNombre) {
                // Actualizar el nombre en el servidor
                actualizarNombreRutina(nuevoNombre);
            } else {
                console.error("El nombre no puede estar vacío");
            }

            // Reemplazar el input con el span
            input.replaceWith(spanNombreRutina);
            spanNombreRutina.textContent = nuevoNombre || spanNombreRutina.textContent;
        });

        // También manejar el evento de presionar Enter para guardar
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                input.blur(); // Simula el evento blur para guardar el cambio
            }
        });
    });

    function actualizarNombreRutina(nuevoNombre) {
        const idRutina = localStorage.getItem("idRutina"); // Obtener el ID de la rutina

        if (!idRutina) {
            console.error("No se encontró el ID de la rutina en el localStorage");
            return;
        }

        // Enviar el nuevo nombre al servidor
        fetch("actualizar_nombre_rutina.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_rutina: idRutina, nombre: nuevoNombre }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al actualizar el nombre de la rutina");
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    console.error("Error al actualizar el nombre:", data.error);
                } else {
                    console.log("Nombre de la rutina actualizado con éxito:", nuevoNombre);
                }
            })
            .catch(error => console.error("Error en la solicitud:", error));
    }
});
