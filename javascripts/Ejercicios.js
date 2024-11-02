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
  
    ejercicios.forEach((ejercicio) => {
      // Crea el contenedor principal del ejercicio
      const ejercicioDiv = document.createElement("div");
      ejercicioDiv.classList.add("elemento");
  
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
  
      // Imagen inicial y final del ejercicio
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
  
      // Características del ejercicio
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
  
      // Botón para agregar ejercicio
      const addButton = document.createElement("button");
      addButton.classList.add("add-button");
      addButton.innerHTML = '<img src="Icons/ICON-add.svg">AGREGAR';
      ejercicioDiv.appendChild(addButton);
  
      // Agrega el ejercicio completo al contenedor principal
      contenedor.appendChild(ejercicioDiv);
    });
  }
  
  // Llama a la función para cargar ejercicios
  cargarEjercicios();