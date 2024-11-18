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
                                        <h2>${ejercicio.nombre}</h2>
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
            })
            .catch((error) => console.error("Error al cargar los ejercicios:", error));
    }
    
    
    
    

    function generarFilasTabla(series, ultimoRegistro) {
        let filas = "";
        for (let i = 1; i <= series; i++) {
            filas += `
                <tr>
                    <td><span>${i}</span></td>
                    <td><input class="repes" type="text" placeholder="0"></td>
                    <td><span class="ultimo-registro">${ultimoRegistro || "N/A"}</span></td>
                </tr>
            `;
        }
        return filas;
    }

    function crearRutina() {
        window.location.href = "gestor-rutinas.html";
    }
});
