document.addEventListener("DOMContentLoaded", function () {
    const tabsContainer = document.querySelector(".tabs");
  
    // Función para cargar las rutinas del usuario
    function cargarRutinas() {
      fetch("obtener_rutinas.php")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al cargar las rutinas desde la base de datos");
          }
          return response.json();
        })
        .then((rutinas) => {
          // Limpia el contenedor de tabs
          tabsContainer.innerHTML = "";
  
          if (rutinas.error) {
            console.error(rutinas.error);
            return;
          }
  
          // Construir los botones dinámicamente
          rutinas.forEach((rutina) => {
            const tabButton = document.createElement("button");
            tabButton.classList.add("tab");
            tabButton.textContent = rutina.nombre;
  
            // Muestra las imágenes de los ejercicios al pasar el mouse (opcional)
            tabButton.addEventListener("mouseenter", () => {
              mostrarEjerciciosPreview(rutina.ejercicios);
            });
  
            tabButton.addEventListener("click", () => seleccionarRutina(tabButton, rutina.id_rutina));
            tabsContainer.appendChild(tabButton);
          });
  
          // Agregar botones "Crear Rutina" si hay menos de 7 rutinas
          const botonesFaltantes = 7 - rutinas.length;
          for (let i = 0; i < botonesFaltantes; i++) {
            const tabButton = document.createElement("button");
            tabButton.classList.add("tab");
            tabButton.textContent = "Crear Rutina";
            tabButton.addEventListener("click", () => seleccionarRutina(tabButton));
            tabsContainer.appendChild(tabButton);
          }
  
          // Marcar el primer botón como activo
          const firstTab = tabsContainer.querySelector(".tab");
          if (firstTab) {
            firstTab.classList.add("active");
          }
        })
        .catch((error) => console.error("Error al cargar las rutinas:", error));
    }
  
    // Función para manejar la selección de rutina
    function seleccionarRutina(tabButton, idRutina = null) {
      console.log("Rutina seleccionada:", idRutina || "Nueva Rutina");
  
      // Desactivar la pestaña activa actualmente
      const activeTab = tabsContainer.querySelector(".tab.active");
      if (activeTab) {
        activeTab.classList.remove("active");
      }
  
      // Marcar la nueva pestaña como activa
      tabButton.classList.add("active");
  
      if (idRutina) {
        // Lógica para cargar datos de la rutina si ya existe
        console.log("Cargando datos de la rutina con ID:", idRutina);
      } else {
        // Redirigir al gestor de rutinas si es una nueva rutina
        crearRutina();
      }
    }
  
    // Función para redirigir al gestor de rutinas
    function crearRutina() {
      console.log("Redirigiendo al gestor de rutinas...");
      window.location.href = "gestor-rutinas.html";
    }
  
    // Función opcional para mostrar un preview de los ejercicios
    function mostrarEjerciciosPreview(ejercicios) {
      if (!ejercicios || ejercicios.length === 0) return;
  
      const previewContainer = document.querySelector(".preview-container");
      if (!previewContainer) return;
  
      previewContainer.innerHTML = ""; // Limpia el contenedor de previsualización
  
      ejercicios.forEach((ejercicio) => {
        const img = document.createElement("img");
        img.src = ejercicio.imagen_inicial;
        img.alt = "Ejercicio";
        previewContainer.appendChild(img);
      });
    }
  
    // Inicializar la carga de rutinas
    cargarRutinas();
  });
  