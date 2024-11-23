document.addEventListener("DOMContentLoaded", function () {
    cargarRutinas();
});

function cargarRutinas() {
    fetch("obtener_rutinas.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }

            const routinesGrid = document.getElementById("routinesGrid");
            const createRoutineDiv = document.getElementById("createRoutine");

            // Guarda temporalmente el div "Crear Rutina"
            const createRoutineHtml = createRoutineDiv.outerHTML;

            // Limpia el contenedor de rutinas antes de agregar nuevos divs
            routinesGrid.innerHTML = "";

            // Vuelve a insertar el div "Crear Rutina"
            routinesGrid.insertAdjacentHTML("beforeend", createRoutineHtml);

            // Mostrar u ocultar la opción de crear rutina según la cantidad de rutinas
            if (data.length >= 7) {
                createRoutineDiv.style.display = "none";
            } else {
                createRoutineDiv.style.display = "block";
            }

            // Generar un div para cada rutina
            data.forEach(rutina => {
                const routineItem = document.createElement("div");
                routineItem.classList.add("routine-item");

                // Agrega las imágenes de los ejercicios
                rutina.ejercicios.slice(0, 4).forEach(ejercicio => {
                    const routineImg = document.createElement("div");
                    routineImg.classList.add("routine-img");

                    const imgFront = document.createElement("img");
                    imgFront.src = ejercicio.imagen_inicial;
                    imgFront.alt = ejercicio.nombre;
                    imgFront.classList.add("image-front");

                    const imgBack = document.createElement("img");
                    imgBack.src = ejercicio.imagen_final;
                    imgBack.alt = ejercicio.nombre;
                    imgBack.classList.add("image-back");

                    routineImg.appendChild(imgFront);
                    routineImg.appendChild(imgBack);
                    routineItem.appendChild(routineImg);
                });

                // Agrega la información de la rutina
                const routineInfo = document.createElement("div");
                routineInfo.classList.add("routine-info");

                const routineName = document.createElement("h3");
                routineName.textContent = rutina.nombre;
                routineInfo.appendChild(routineName);

                // Contenedor de botones
                const editInfoDiv = document.createElement("div");
                editInfoDiv.classList.add("edit-info");

                // Botón para editar la rutina
                const editButton = document.createElement("button");
                editButton.classList.add("editButton");
                editButton.textContent = "Editar Rutina";
                editButton.addEventListener("click", () => redirigirARutina(rutina.id_rutina));

                // Botón para eliminar la rutina
                const removeButton = document.createElement("button");
                removeButton.classList.add("removeButton");

                const removeIcon = document.createElement("img");
                removeIcon.src = "Icons/ICON-delete.svg";
                removeButton.appendChild(removeIcon);

                removeButton.addEventListener("click", () => eliminarRutina(rutina.id_rutina));

                editInfoDiv.appendChild(editButton);
                editInfoDiv.appendChild(removeButton);

                routineInfo.appendChild(editInfoDiv);
                routineItem.appendChild(routineInfo);

                // Agrega la rutina al contenedor principal
                routinesGrid.appendChild(routineItem);
            });
        })
        .catch(error => console.error("Error en la solicitud:", error));
}


function crearRutina() {
    // Llama al PHP para crear la rutina y obtener su ID
    fetch("crear_rutina.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nombre: "Mi Rutina" // Nombre por defecto
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error al crear la rutina:", data.error);
                return;
            }

            const idRutina = data.id_rutina;
            console.log("ID de la rutina creada:", idRutina);

            // Guarda el id_rutina en localStorage y redirige
            localStorage.setItem("idRutina", idRutina);
            window.location.href = "Creacion-rutina.html";
        })
        .catch(error => console.error("Error en la solicitud:", error));
}

// Función para redirigir a la página de creación de rutina con el idRutina en localStorage
function redirigirARutina(idRutina) {
    console.log("Guardando en localStorage el ID de la rutina:", idRutina); // Depuración
    localStorage.setItem("idRutina", idRutina);
    window.location.href = "Creacion-rutina.html";
}

function eliminarRutina(idRutina) {
    if (confirm("¿Estás seguro que quieres eliminar la rutina? No podrás recuperarla.")) {
        fetch("eliminar_rutina.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_rutina: idRutina })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Rutina eliminada con éxito.");
                    cargarRutinas(); // Recargar las rutinas después de eliminar
                } else {
                    console.error(data.error || "Error al eliminar la rutina.");
                    alert("Error al eliminar la rutina.");
                }
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
                alert("Error en la solicitud al servidor.");
            });
    }
}

