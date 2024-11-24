document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("grafica");

    // Ajustar tamaño del canvas
    canvas.width = 622;
    canvas.height = 530;

    let chart;

    // Inicializa el gráfico vacío
    function inicializarGraficoVacio() {
        chart = new Chart(canvas, {
            type: "line",
            data: {
                labels: ["Sin datos"], // Etiqueta inicial para los ejes
                datasets: [
                    {
                        label: "Peso (kg)",
                        data: [0], // Sin datos iniciales
                        borderColor: "rgba(0, 212, 255, 1)",
                        backgroundColor: "rgba(0, 212, 255, 1)",
                        borderWidth: 2,
                        pointRadius: 0 // Sin puntos iniciales
                    }
                ]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        display: true,
                        position: "top"
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Fecha",
                            color: "rgba(255, 255, 255, 1)"
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 1)"
                        },
                        grid: {
                            color: "rgba(91, 94, 95, 1)"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Peso (kg)",
                            color: "rgba(255, 255, 255, 1)"
                        },
                        ticks: {
                            color: "rgba(255, 255, 255, 1)"
                        },
                        grid: {
                            color: "rgba(91, 94, 95, 1)"
                        }
                    }
                }
            }
        });
    }

    // Función para cargar los datos del gráfico
    function cargarGrafico(idEjercicio) {
        fetch(`obtener_datos_grafico.php?id_ejercicio=${idEjercicio}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const fechas = data.data.map(item => item.fecha);
                    const pesos = data.data.map(item => item.peso);

                    // Si el gráfico ya existe, destrúyelo para crear uno nuevo
                    if (chart) {
                        chart.destroy();
                    }

                    // Crear el gráfico
                    chart = new Chart(canvas, {
                        type: "line",
                        data: {
                            labels: fechas,
                            datasets: [
                                {
                                    label: "Peso (kg)",
                                    data: pesos,
                                    borderColor: "rgba(0, 212, 255, 1)",
                                    backgroundColor: "rgba(0, 212, 255, 1)",
                                    borderWidth: 2,
                                    pointRadius: 5,
                                    pointBackgroundColor: "rgba(0, 212, 255, 1)"
                                }
                            ]
                        },
                        options: {
                            responsive: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: "top"
                                }
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: "Fecha",
                                        color: "rgba(255, 255, 255, 1)"
                                    },
                                    ticks: {
                                        color: "rgba(255, 255, 255, 1)"
                                    },
                                    grid: {
                                        color: "rgba(91, 94, 95, 1)"
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: "Peso (kg)",
                                        color: "rgba(255, 255, 255, 1)"
                                    },
                                    ticks: {
                                        color: "rgba(255, 255, 255, 1)"
                                    },
                                    grid: {
                                        color: "rgba(91, 94, 95, 1)"
                                    }
                                }
                            }
                        }
                    });
                } else {
                    console.error("Error al cargar los datos del gráfico:", data.message);
                }
            })
            .catch(error => console.error("Error:", error));
    }

    // Inicializar el gráfico vacío al cargar la página
    inicializarGraficoVacio();

    // Evento para cargar el gráfico según el botón seleccionado
    document.querySelector(".button").addEventListener("click", function (event) {
        const target = event.target;
        if (target.tagName === "BUTTON" && target.dataset.idEjercicio) {
            const idEjercicio = target.dataset.idEjercicio;
            cargarGrafico(idEjercicio);
        }
    });
});
