function cargarEjercicios() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "ejercicios.json", true);
  
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const ejercicios = JSON.parse(xhr.responseText);
          mostrarEjercicios(ejercicios);
        } catch (error) {
          console.error("Error al parsear JSON:", error);
        }
      } else {
        console.error("Error al cargar el archivo JSON.");
      }
    };
  
    xhr.send();
  }
  
  function mostrarEjercicios(ejercicios) {
    const contenedor = document.getElementById("element");
  
    ejercicios.forEach((ejercicio, index) => {
      // Crea el contenedor principal del ejercicio
      const ejercicioDiv = document.createElement("div");
      ejercicioDiv.classList.add("elemento");
      ejercicioDiv.dataset.index = index; // Identificador único para cada ejercicio
  
      // Título del ejercicio
      const tituloDiv = document.createElement("div");
      tituloDiv.classList.add("contenedor-titulo");
      const titulo = document.createElement("h2");
      titulo.classList.add("titulo");
      titulo.textContent = ejercicio.nombre;
      tituloDiv.appendChild(titulo);
      ejercicioDiv.appendChild(tituloDiv);
  
      // Contenedor de imágenes y características
      const contenedorDiv = document.createElement("div");
      contenedorDiv.classList.add("contenedor");
  
      const imageHolder = document.createElement("div");
      imageHolder.classList.add("image-holder");
  
      const imgInicial = document.createElement("img");
      imgInicial.classList.add("imagen-superior");
      imgInicial.src = ejercicio.imagenes.inicial;
      imgInicial.alt = `${ejercicio.nombre} - Posición inicial`;
      imageHolder.appendChild(imgInicial);
  
      const imgFinal = document.createElement("img");
      imgFinal.classList.add("imagen-inferior");
      imgFinal.src = ejercicio.imagenes.final;
      imgFinal.alt = `${ejercicio.nombre} - Posición final`;
      imageHolder.appendChild(imgFinal);
  
      contenedorDiv.appendChild(imageHolder);
  
      const caracteristicasDiv = document.createElement("div");
      caracteristicasDiv.classList.add("caracterisicas-ejercicio");
  
      const nivel = document.createElement("h3");
      nivel.textContent = ejercicio.nivel;
      caracteristicasDiv.appendChild(nivel);
  
      const grupoMuscular = document.createElement("h4");
      grupoMuscular.textContent = ejercicio.grupo_muscular;
      caracteristicasDiv.appendChild(grupoMuscular);
  
      const descripcionDiv = document.createElement("div");
      descripcionDiv.classList.add("contenedor-parrafo");
      const descripcion = document.createElement("p");
      descripcion.classList.add("parrafo");
      descripcion.textContent = ejercicio.descripcion;
      descripcionDiv.appendChild(descripcion);
      caracteristicasDiv.appendChild(descripcionDiv);
  
      contenedorDiv.appendChild(caracteristicasDiv);
      ejercicioDiv.appendChild(contenedorDiv);
  
      // Botón para agregar ejercicio con event listener
      const addButton = document.createElement("button");
      addButton.classList.add("add-button");
      addButton.innerHTML = '<img src="Icons/ICON-add.svg">AGREGAR';
      addButton.dataset.index = index; // Asigna el índice como identificador
      addButton.addEventListener("click", () => cambiarClase(ejercicioDiv, ejercicio.nombre));
      ejercicioDiv.appendChild(addButton);
  
      // Agrega el ejercicio completo al contenedor principal
      contenedor.appendChild(ejercicioDiv);
    });
  }
  
  // Función para cambiar la clase al hacer clic en "AGREGAR"
  function cambiarClase(ejercicioDiv, nombreEjercicio) {
    ejercicioDiv.classList.remove("elemento");
    ejercicioDiv.classList.add("elemento-series-repes");
  
    // Limpia el contenido anterior y agrega los campos de series y repeticiones
    ejercicioDiv.innerHTML = `
      <div class="contenedor-titulo">
          <h2 class="titulo">${nombreEjercicio}</h2>
      </div>
      <div class="contenedor-series-repes">
          <div class="series-repes">
              <span class="titulo-series-repes">Número de <br>series</span>
              <input type="number" class="input-numero" placeholder="0">
          </div>
          <div class="series-repes">
              <span class="titulo-series-repes">Número de <br>repeticiones</span>
              <input type="number" class="input-numero" placeholder="0">
          </div>
      </div>
      <button class="add-button"><img src="Icons/ICON-add.svg">GUARDAR</button>
    `;
  }
  
  // Llama a la función para cargar ejercicios
  cargarEjercicios();