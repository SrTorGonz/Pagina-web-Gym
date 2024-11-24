document.addEventListener("DOMContentLoaded", function () {
    const calendarContainer = document.getElementById("calendar");
    const summaryContainer = document.querySelector(".training-summary");

    if (typeof FullCalendar === "undefined") {
        console.error("FullCalendar no está definido. Revisa si el script está cargado correctamente.");
        return;
    }

    // Inicializar el calendario
    const calendar = new FullCalendar.Calendar(calendarContainer, {
        initialView: "dayGridMonth",
        selectable: true,
        dateClick: function (info) {
            const selectedDate = new Date(info.dateStr);
            const week = getWeek(selectedDate); // Obtener las fechas de la semana
            marcarSemana(week);
            cargarEntrenamientosSemana(week); // Consultar y cargar los entrenamientos
        }
    });

    calendar.render();

    // Función para calcular las fechas de la semana (lunes a domingo)
    function getWeek(date) {
        const dayOfWeek = date.getDay(); // 0 (domingo) a 6 (sábado)
        const startOfWeek = new Date(date);
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Ajusta para que el lunes sea el primer día de la semana
    
        startOfWeek.setDate(startOfWeek.getDate() + diff);
        startOfWeek.setHours(0, 0, 0, 0); // Ajusta a medianoche local
    
        const week = [];
        for (let i = 0; i < 7; i++) {
            const current = new Date(startOfWeek);
            current.setDate(startOfWeek.getDate() + i);
            current.setHours(0, 0, 0, 0); // Asegura que cada día esté en medianoche local
            week.push(current);
        }
        return week;
    }

    // Función para marcar la semana seleccionada en el calendario
    function marcarSemana(week) {
        calendar.getEvents().forEach(event => event.remove());
        week.forEach(day => {
            calendar.addEvent({
                start: day.toISOString().split("T")[0],
                backgroundColor: "#DFF0D8",
                borderColor: "#DFF0D8",
                allDay: true
            });
        });
    }

    // Función para cargar los entrenamientos de la semana
    function cargarEntrenamientosSemana(week) {
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
                if (data.error) {
                    console.error("Error en el servidor:", data.error);
                    return;
                }
                generarResumenEntrenamientos(week, data);
            })
            .catch(error => {
                console.error("Error al cargar entrenamientos:", error);
                summaryContainer.innerHTML = "<p>Error al cargar los entrenamientos.</p>";
            });
    }

    // Generar los botones del resumen dinámicamente
    function generarResumenEntrenamientos(week, data) {
        summaryContainer.innerHTML = "";
        week.forEach(date => {
            const day = date.getDate();
            const month = date.toLocaleDateString("es-ES", { month: "long" }); // Formatear mes
            const entrenamiento = data.find(item => item.fecha === date.toISOString().split("T")[0]);
    
            const button = document.createElement("button");
            button.innerHTML = `
                <div class="boton-info">
                    <div class="container-fecha">
                        <span class="fecha">${day}</span>
                        <span class="fecha">${month}</span>
                    </div>
                    <span class="nombre">${entrenamiento ? entrenamiento.rutina : "Sin registro"}</span>
                </div>
            `;
            summaryContainer.appendChild(button);
        });
    }

    // Marcar la semana de la fecha actual al cargar la página
    const today = new Date();
    const currentWeek = getWeek(today);
    marcarSemana(currentWeek);
    cargarEntrenamientosSemana(currentWeek);
});
