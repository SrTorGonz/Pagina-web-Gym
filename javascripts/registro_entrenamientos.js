document.addEventListener("DOMContentLoaded", function () {
    const tabsContainer = document.querySelector(".tabs");
    const exerciseSection = document.querySelector(".exercise-section");

    // Carga las rutinas del usuario y crea las pestañas
    cargarRutinas();

    function cargarRutinas() {
        fetch("obtener_rutinas.php")
            .then((response) => response.json())
            .then((rutinas) => {
                tabsContainer.innerHTML = "";

                if (rutinas.error) {
                    console.error(rutinas.error);
                    return;
                }

                rutinas.forEach((rutina) => {
                    const tabButton = document.createElement("button");
                    tabButton.classList.add("tab");
                    tabButton.textContent = rutina.nombre;
                    tabButton.addEventListener("click", () => seleccionarRutina(tabButton, rutina.id_rutina));
                    tabsContainer.appendChild(tabButton);
                });

                const botonesFaltantes = 7 - rutinas.length;
                for (let i = 0; i < botonesFaltantes; i++) {
                    const tabButton = document.createElement("button");
                    tabButton.classList.add("tab");
                    tabButton.textContent = "Crear Rutina";
                    tabButton.addEventListener("click", () => crearRutina());
                    tabsContainer.appendChild(tabButton);
                }

                const firstTab = tabsContainer.querySelector(".tab");
                if (firstTab) {
                    firstTab.click();
                }
            })
            .catch((error) => console.error("Error al cargar las rutinas:", error));
    }

    function seleccionarRutina(tabButton, idRutina) {
        const activeTab = tabsContainer.querySelector(".tab.active");
        if (activeTab) activeTab.classList.remove("active");

        tabButton.classList.add("active");
        cargarEjerciciosRutina(idRutina);
    }

    function cargarEjerciciosRutina(idRutina) {
        fetch(`obtener_ejercicios_rutina.php?id_rutina=${idRutina}`)
            .then((response) => response.json())
            .then((ejercicios) => {
                if (ejercicios.error) {
                    console.error(ejercicios.error);
                    return;
                }
    
                const exerciseSection = document.querySelector(".exercise-section");
                exerciseSection.innerHTML = ""; // Limpia la sección de ejercicios
    
                ejercicios.forEach((ejercicio) => {
                    const detalles = Array.isArray(ejercicio.detalles) ? ejercicio.detalles : [];
                    const pesoPrevio = ejercicio.ultimo_peso || "N/A";
    
                    const componenteDiv = document.createElement("div");
                    componenteDiv.classList.add("componente");
    
                    // Generar las filas de la tabla con los datos de las series
                    const filasTabla = detalles.map((detalle) => `
                        <tr>
                            <td><span>${detalle.serie}</span></td>
                            <td><input class="repes" type="text" placeholder="0"></td>
                            <td><span class="ultimo-registro">${detalle.ultimo_registro || "N/A"}</span></td>
                        </tr>
                    `).join("");
    
                    // Construir la estructura HTML
                    componenteDiv.innerHTML = `
                        <div class="exercise-content">
                            <div class="columna-peso">
                                <div class="title-image">
                                    <div class="exercise-title">
                                        <h2 data-id="${ejercicio.id_ejercicio}">${ejercicio.nombre}</h2>
                                    </div>
                                    <div class="image-holder">
                                        <img class="imagen-superior" src="${ejercicio.imagen_inicial}" alt="${ejercicio.nombre} 1">
                                        <img class="imagen-inferior" src="${ejercicio.imagen_final}" alt="${ejercicio.nombre} 2">
                                    </div>
                                </div>
                                <div class="stat">
                                    <span class="sets-reps">${ejercicio.total_series}x${ejercicio.repeticiones_por_serie}</span>
                                    <div>
                                        <p class="table-title">Peso</p>
                                        <input type="text" placeholder="kg">
                                    </div>
                                    <div class="ultimo-peso">
                                        <span class="peso-previo">${pesoPrevio} kg</span>
                                        <p class="peso-previo">Último<br>registro</p>
                                    </div>
                                </div>
                            </div>
                            <div class="exercise-stats">
                                <table>
                                    <thead>
                                        <tr>
                                            <th><p class="table-title">Serie</p></th>
                                            <th><p class="table-title">Repeticiones</p></th>
                                            <th><p class="ultimo-registro">Último<br> Registro</p></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filasTabla}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <hr />
                    `;
    
                    exerciseSection.appendChild(componenteDiv);
                });
    
                // Asegúrate de pasar el `idRutina` aquí
                agregarSeccionGuardar(idRutina);
            })
            .catch((error) => console.error("Error al cargar los ejercicios:", error));
    }
    

    function agregarSeccionGuardar(idRutina) {
        const submitSection = document.createElement("div");
        submitSection.classList.add("submit");

        const fechaActual = new Date().toISOString().split("T")[0]; // Obtiene la fecha actual en formato YYYY-MM-DD

        submitSection.innerHTML = `
            <div class="section-fecha">
                <label for="fecha">Fecha:</label>
                <input class="input-fecha" type="date" id="fecha" name="fecha" value="${fechaActual}">
            </div>
            <button class="save-button">GUARDAR</button>
        `;

        const exerciseSection = document.querySelector(".exercise-section");
        exerciseSection.appendChild(submitSection);

        // Agregar evento al botón "GUARDAR"
        const saveButton = submitSection.querySelector(".save-button");
        saveButton.addEventListener("click", () => guardarEntrenamiento(idRutina));
    }

    function guardarEntrenamiento(idRutina) {
        const fechaInput = document.querySelector("#fecha");
        const fecha = fechaInput.value;
    
        // Recuperar todos los datos de los inputs
        const componentes = document.querySelectorAll(".componente");
        const detalles = [];
    
        componentes.forEach((componente) => {
            const idEjercicio = componente.querySelector(".exercise-title h2").getAttribute("data-id");
            const pesoInput = componente.querySelector(".columna-peso input[type='text']");
            const filas = componente.querySelectorAll(".exercise-stats tbody tr");
    
            filas.forEach((fila, index) => {
                const serie = index + 1;
                const repeticionesInput = fila.querySelector("input.repes");
                const peso = parseFloat(pesoInput.value) || 0;
                const repeticiones = parseInt(repeticionesInput.value) || 0;
    
                detalles.push({
                    id_ejercicio: parseInt(idEjercicio, 10), // Asegúrate de convertir el ID a número
                    peso: peso,
                    serie: serie,
                    repeticiones: repeticiones
                });
            });
        });
    
        // Enviar datos al servidor
        fetch("guardar_entrenamiento.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_rutina: idRutina,
                fecha: fecha,
                detalles: detalles
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Entrenamiento guardado con éxito");
                    limpiarInputs();
                    cargarEjerciciosRutina(idRutina); // Actualizar los divs después de guardar
                } else if (data.error === "Ya existe un entrenamiento para esta fecha.") {
                    // Si ya existe un entrenamiento, pedir confirmación al usuario
                    if (confirm(`${data.error} ¿Deseas sobrescribir los datos?`)) {
                        sobrescribirEntrenamiento(data.entrenamiento_id, detalles, idRutina);
                    }
                } else {
                    console.error(data.error || "Error al guardar el entrenamiento");
                    alert("Error al guardar el entrenamiento");
                }
            })
            .catch((error) => {
                console.error("Error en la solicitud:", error);
                alert("Error en la solicitud al servidor");
            });
    }
    
    function sobrescribirEntrenamiento(entrenamientoId, detalles, idRutina) {
        fetch("actualizar_entrenamiento.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_entrenamiento: entrenamientoId,
                detalles: detalles
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Entrenamiento actualizado con éxito");
                    limpiarInputs();
                    cargarEjerciciosRutina(idRutina); // Actualizar los divs después de actualizar
                } else {
                    console.error(data.error || "Error al actualizar el entrenamiento");
                    alert("Error al actualizar el entrenamiento");
                }
            })
            .catch((error) => {
                console.error("Error en la solicitud:", error);
                alert("Error en la solicitud al servidor");
            });
    }
    
    function limpiarInputs() {
        const pesoInputs = document.querySelectorAll(".columna-peso input[type='text']");
        const repeticionesInputs = document.querySelectorAll(".exercise-stats tbody input.repes");
    
        pesoInputs.forEach((input) => (input.value = ""));
        repeticionesInputs.forEach((input) => (input.value = ""));
    }
    
    

    function crearRutina() {
        window.location.href = "gestor-rutinas.html";
    }
});
