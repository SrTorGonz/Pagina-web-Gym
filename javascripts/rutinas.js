document.addEventListener("DOMContentLoaded", function() {
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

            // Si el usuario tiene 7 rutinas, elimina la opción de crear nueva rutina
            if (data.length >= 7) {
                createRoutineDiv.style.display = "none";
            }

            // Genera un div para cada rutina
            data.forEach(rutina => {
                const routineItem = document.createElement("div");
                routineItem.classList.add("routine-item");

                // Agrega las imágenes de los ejercicios
                rutina.ejercicios.forEach(ejercicio => {
                    const routineImg = document.createElement("div");
                    routineImg.classList.add("routine-img");

                    const imgFront = document.createElement("img");
                    imgFront.src = ejercicio.imagen_inicial;
                    imgFront.alt = "Ejercicio";
                    imgFront.classList.add("image-front");

                    const imgBack = document.createElement("img");
                    imgBack.src = ejercicio.imagen_final;
                    imgBack.alt = "Ejercicio";
                    imgBack.classList.add("image-back");

                    routineImg.appendChild(imgFront);
                    routineImg.appendChild(imgBack);
                    routineItem.appendChild(routineImg);
                });

                // Agrega el nombre de la rutina y el botón para editar
                const routineInfo = document.createElement("div");
                routineInfo.classList.add("routine-info");

                const routineName = document.createElement("h3");
                routineName.textContent = rutina.nombre;
                routineInfo.appendChild(routineName);

                const editLink = document.createElement("a");
                editLink.href = "Creacion-rutina.html";

                const editButton = document.createElement("button");
                editButton.textContent = "Editar Rutina";
                editLink.appendChild(editButton);

                routineInfo.appendChild(editLink);
                routineItem.appendChild(routineInfo);

                // Agrega la rutina al contenedor principal
                routinesGrid.appendChild(routineItem);
            });
        })
        .catch(error => console.error("Error en la solicitud:", error));
}
