document.addEventListener("DOMContentLoaded", function () {
    const calendarContainer = document.getElementById("calendar");
    const summaryContainer = document.querySelector(".training-summary");
    const tableContainer = document.querySelector(".container-table");

    let selectedButton = null;

    if (typeof FullCalendar === "undefined") {
        console.error("FullCalendar no está definido. Revisa si el script está cargado correctamente.");
        return;
    }

    const calendar = new FullCalendar.Calendar(calendarContainer, {
        initialView: "dayGridMonth",
        selectable: true,
        dateClick: function (info) {
            const selectedDate = new Date(info.dateStr);
            const week = getWeek(selectedDate);
            marcarSemana(week, selectedDate);
            cargarEntrenamientosSemana(week, selectedDate);
        }
    });

    calendar.render();

    function getWeek(date) {
        const dayOfWeek = date.getDay();
        const startOfWeek = new Date(date);
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

        startOfWeek.setDate(startOfWeek.getDate() + diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const week = [];
        for (let i = 0; i < 7; i++) {
            const current = new Date(startOfWeek);
            current.setDate(startOfWeek.getDate() + i);
            week.push(current);
        }
        return week;
    }

    function marcarSemana(week, selectedDate) {
        calendar.getEvents().forEach(event => event.remove());
        week.forEach(day => {
            calendar.addEvent({
                start: day.toISOString().split("T")[0],
                backgroundColor: "#DFF0D8",
                borderColor: "#DFF0D8",
                allDay: true
            });
        });

        const buttons = summaryContainer.querySelectorAll("button");
        buttons.forEach(button => {
            const buttonDate = button.dataset.date;
            if (buttonDate === selectedDate.toISOString().split("T")[0]) {
                if (selectedButton) {
                    selectedButton.classList.remove("selected");
                }
                button.classList.add("selected");
                selectedButton = button;

                // Cargar la tabla para el día seleccionado
                cargarTablaEntrenamientos(buttonDate);
            }
        });
    }

    function cargarEntrenamientosSemana(week, selectedDate) {
        const fechas = week.map(date => date.toISOString().split("T")[0]);

        fetch("obtener_entrenamientos_semana.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fechas })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                generarResumenEntrenamientos(week, data, selectedDate);
            })
            .catch(error => {
                console.error("Error al cargar entrenamientos:", error);
                summaryContainer.innerHTML = "<p>Error al cargar los entrenamientos.</p>";
            });
    }

    function generarResumenEntrenamientos(week, data, selectedDate) {
        summaryContainer.innerHTML = "";

        week.forEach(date => {
            const day = date.getDate();
            const month = date.toLocaleDateString("es-ES", { month: "long" });
            const entrenamiento = data.find(item => item.fecha === date.toISOString().split("T")[0]);

            const button = document.createElement("button");
            button.dataset.date = date.toISOString().split("T")[0];
            button.innerHTML = `
                <div class="boton-info">
                    <div class="container-fecha">
                        <span class="fecha">${day}</span>
                        <span class="fecha">${month}</span>
                    </div>
                    <span class="nombre">${entrenamiento ? entrenamiento.rutina : "Sin registro"}</span>
                </div>
            `;

            button.addEventListener("click", function () {
                if (selectedButton) {
                    selectedButton.classList.remove("selected");
                }
                button.classList.add("selected");
                selectedButton = button;

                cargarTablaEntrenamientos(button.dataset.date);
            });

            if (selectedDate && button.dataset.date === selectedDate.toISOString().split("T")[0]) {
                button.classList.add("selected");
                selectedButton = button;

                cargarTablaEntrenamientos(button.dataset.date);
            }

            summaryContainer.appendChild(button);
        });
    }

    function cargarTablaEntrenamientos(fecha) {
        fetch("obtener_entrenamiento_dia.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fecha })
        })
            .then(response => response.json())
            .then(data => {
                generarTablaEntrenamientos(data.entrenamientos, data.maxSeries);
            })
            .catch(error => {
                console.error("Error al cargar la tabla:", error);
                tableContainer.innerHTML = "<p>Error al cargar la tabla de entrenamientos.</p>";
            });
    }
    
    function generarTablaEntrenamientos(entrenamientos, maxSeries) {
        // Crear encabezado dinámico
        const headers = `
            <tr>
                <th><span>Ejercicio</span></th>
                <th><span>Peso</span></th>
                ${Array.from({ length: maxSeries }, (_, i) => `<th><span>Serie ${i + 1}</span></th>`).join("")}
            </tr>
        `;
    
        // Crear filas dinámicas
        const rows = entrenamientos.map(ejercicio => {
            const series = Array.from({ length: maxSeries }, (_, i) => {
                const serieNum = i + 1;
                return `<td><span>${ejercicio.series[serieNum] || ""}</span></td>`;
            }).join("");
    
            return `
                <tr>
                    <td><span>${ejercicio.nombre}</span></td>
                    <td><span>${ejercicio.peso}</span></td>
                    ${series}
                </tr>
            `;
        }).join("");
    
        // Construir la tabla
        tableContainer.innerHTML = `
            <table class="exercise-table">
                <thead>
                    ${headers}
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }
    

    // Marcar la semana de la fecha actual al cargar la página
    const today = new Date();
    const currentWeek = getWeek(today);
    marcarSemana(currentWeek);
    cargarEntrenamientosSemana(currentWeek);
    resaltarBoton(today); // Resaltar el botón del día actual
});