document.addEventListener("DOMContentLoaded", function () {
    const buttonContainer = document.querySelector(".button"); // Contenedor de los botones
    const searchInput = document.querySelector(".search-input"); // Input de búsqueda

    let ejercicios = []; // Variable para almacenar los ejercicios obtenidos

    // Realizar la solicitud a obtener_ejercicios.php
    fetch("obtener_ejercicios.php?id_rutina=1") // Cambia `id_rutina=1` por el valor dinámico si aplica
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                ejercicios = data; // Almacenar los ejercicios en la variable global
                mostrarEjercicios(ejercicios); // No mostrar ningún ejercicio inicialmente
            } else {
                buttonContainer.innerHTML = "<p>No hay ejercicios disponibles.</p>";
            }
        })
        .catch(error => {
            console.error("Error al cargar los ejercicios:", error);
            buttonContainer.innerHTML = "<p>Error al cargar los ejercicios.</p>";
        });

    // Función para mostrar los ejercicios
    function mostrarEjercicios(lista) {
        buttonContainer.innerHTML = ""; // Limpiar los botones existentes
        lista.forEach(ejercicio => {
            const button = document.createElement("button");
            button.textContent = ejercicio.nombre; // Nombre del ejercicio
            button.classList.add("exercise-button");

            // Agregar un evento click para seleccionar/deseleccionar
            button.addEventListener("click", function () {
                if (button.classList.contains("selected")) {
                    // Si ya está seleccionado, quitar la selección
                    button.classList.remove("selected");
                } else {
                    // Seleccionar el botón y deseleccionar los demás
                    document.querySelectorAll(".exercise-button").forEach(btn => {
                        btn.classList.remove("selected");
                    });
                    button.classList.add("selected");
                }
            });

            // Añadir el botón al contenedor
            buttonContainer.appendChild(button);
        });

        // Mostrar un mensaje si no hay coincidencias
        if (lista.length === 0 && searchInput.value.trim() !== "") {
            buttonContainer.innerHTML = "<p>No se encontraron ejercicios.</p>";
        }
    }

    // Función para normalizar texto (elimina tildes y convierte a minúsculas)
    function normalizarTexto(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // Filtro de búsqueda
    searchInput.addEventListener("input", function () {
        const query = normalizarTexto(searchInput.value.trim()); // Normalizar texto ingresado
        const ejerciciosFiltrados = ejercicios.filter(ejercicio =>
            normalizarTexto(ejercicio.nombre).includes(query) // Comparar nombres normalizados
        );
        mostrarEjercicios(ejerciciosFiltrados); // Actualizar la lista de botones
    });
});


