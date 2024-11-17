let ejerciciosGlobal = []; // Variable global para almacenar todos los ejercicios
let filtroActivo = "todos"; // Mantiene el estado del filtro de grupo muscular activo

function cargarEjercicios(idUsuario, idRutina) {
  console.log("Cargando ejercicios para usuario y rutina:", idUsuario, idRutina);
  
  fetch(`obtener_ejercicios.php?id_usuario=${idUsuario}&id_rutina=${idRutina}`) // Llama al archivo PHP
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al cargar los ejercicios desde la base de datos");
      }
      return response.json();
    })
    .then(ejercicios => {
      console.log("Ejercicios recibidos:", ejercicios); // Verifica los datos en la consola
      ejerciciosGlobal = ejercicios; // Guarda los ejercicios en una variable global
      mostrarEjercicios(ejercicios);
      configurarFiltros();
      configurarBusqueda(); // Configura la búsqueda una vez cargados los ejercicios
    })
    .catch(error => console.error("Error:", error));
}

function mostrarEjercicios(ejercicios) {
  const contenedor = document.getElementById("element");
  contenedor.innerHTML = ""; // Limpia el contenedor antes de mostrar los ejercicios

  // Ordena los ejercicios alfabéticamente por el nombre
  const ejerciciosOrdenados = ejercicios.sort((a, b) => a.nombre.localeCompare(b.nombre));

  ejerciciosOrdenados.forEach((ejercicio) => {
    const ejercicioDiv = document.createElement("div");
    ejercicioDiv.classList.add("elemento");
    ejercicioDiv.dataset.grupoMuscular = ejercicio.grupo_muscular;

    const tituloDiv = document.createElement("div");
    tituloDiv.classList.add("contenedor-titulo");
    const titulo = document.createElement("h2");
    titulo.classList.add("titulo");
    titulo.textContent = ejercicio.nombre;
    tituloDiv.appendChild(titulo);
    ejercicioDiv.appendChild(tituloDiv);

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

    if (ejercicio.id_rutina !== null) {
      // Si el ejercicio ya está en la rutina, muestra botones de editar y remover
      const botonMixto = document.createElement("div");
      botonMixto.classList.add("boton-mixto");

      const editButton = document.createElement("button");
      editButton.classList.add("add-button-half");
      editButton.innerHTML = '<img src="Icons/ICON-add.svg">EDITAR';
      editButton.addEventListener("click", () => editarEjercicio(ejercicio.id_ejercicio));

      const removeButton = document.createElement("button");
      removeButton.classList.add("remove-button");
      removeButton.innerHTML = '<img src="Icons/ICON-remover.svg">REMOVER';
      removeButton.addEventListener("click", () => removerEjercicio(ejercicio.id_ejercicio));

      botonMixto.appendChild(editButton);
      botonMixto.appendChild(removeButton);
      ejercicioDiv.appendChild(botonMixto);
    } else {
      // Si no está en la rutina, muestra el botón de agregar
      const addButton = document.createElement("button");
      addButton.classList.add("add-button");
      addButton.innerHTML = '<img src="Icons/ICON-add.svg">AGREGAR';
      addButton.addEventListener("click", () => agregarEjercicio(ejercicio.id_ejercicio));
      ejercicioDiv.appendChild(addButton);
    }

    contenedor.appendChild(ejercicioDiv);
  });
}

// Función para configurar la búsqueda
function configurarBusqueda() {
  const searchInput = document.querySelector(".search-input");
  
  searchInput.addEventListener("input", (e) => {
    const searchText = normalizarTexto(e.target.value); // Normaliza el texto de búsqueda
    
    // Aplica el filtro activo junto con la búsqueda
    aplicarFiltros(filtroActivo, searchText);
  });
}

// Función para configurar los filtros de grupo muscular
function configurarFiltros() {
  const botonesFiltro = document.querySelectorAll(".category");
  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const grupoMuscular = e.target.dataset.group;

      // Si el botón ya está activo, elimina la clase y muestra todos los ejercicios
      if (e.target.classList.contains("active")) {
        e.target.classList.remove("active");
        filtroActivo = "todos"; // Resetea el filtro
      } else {
        // Elimina la clase 'active' de todos los botones
        botonesFiltro.forEach(btn => btn.classList.remove("active"));

        // Añade la clase 'active' solo al botón clicado
        e.target.classList.add("active");
        filtroActivo = grupoMuscular; // Actualiza el filtro activo
      }

      // Aplica el filtro con el texto actual de búsqueda
      const searchText = normalizarTexto(document.querySelector(".search-input").value);
      aplicarFiltros(filtroActivo, searchText);
    });
  });
}

// Función para aplicar los filtros de grupo muscular y búsqueda
function aplicarFiltros(grupoMuscular, searchText) {
  let ejerciciosFiltrados = ejerciciosGlobal;

  // Aplica el filtro de "ejercicios agregados"
  if (grupoMuscular === "agregados") {
    ejerciciosFiltrados = ejerciciosFiltrados.filter(ejercicio => ejercicio.id_rutina !== null);
  } else if (grupoMuscular !== "todos") {
    // Aplica el filtro de grupo muscular si no es 'todos'
    ejerciciosFiltrados = ejerciciosFiltrados.filter(ejercicio =>
      ejercicio.grupo_muscular === grupoMuscular
    );
  }

  // Aplica el filtro de búsqueda si hay texto en la barra de búsqueda
  if (searchText) {
    ejerciciosFiltrados = ejerciciosFiltrados.filter(ejercicio =>
      normalizarTexto(ejercicio.nombre).includes(searchText)
    );
  }

  // Muestra los ejercicios filtrados
  mostrarEjercicios(ejerciciosFiltrados);
}

// Función para normalizar texto eliminando tildes y mayúsculas
function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function editarEjercicio(idEjercicio) {
  console.log("Editar ejercicio:", idEjercicio);
}

function removerEjercicio(idEjercicio) {
  console.log("Remover ejercicio:", idEjercicio);
}

function agregarEjercicio(idEjercicio) {
  console.log("Agregar ejercicio:", idEjercicio);
}

const idUsuario = 1; // Reemplaza con el ID del usuario en sesión
const idRutina = localStorage.getItem("idRutina");
cargarEjercicios(idUsuario, idRutina);
