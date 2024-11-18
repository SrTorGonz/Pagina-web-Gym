let ejerciciosGlobal = []; // Variable global para almacenar todos los ejercicios
let filtroActivo = "todos"; // Mantiene el estado del filtro de grupo muscular activo

function cargarEjercicios(idRutina) {
  console.log("Cargando ejercicios para usuario y rutina:",idRutina);
  
  fetch(`obtener_ejercicios.php?id_rutina=${idRutina}`) // Llama al archivo PHP
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
    ejercicioDiv.setAttribute("data-id", ejercicio.id_ejercicio); // Agrega el atributo data-id
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
  const elementos = document.querySelectorAll(".elemento");

  elementos.forEach((elemento) => {
    const idEjercicio = parseInt(elemento.dataset.id, 10);
    const ejercicio = ejerciciosGlobal.find(e => e.id_ejercicio === idEjercicio);

    if (!ejercicio) {
      elemento.style.display = "none";
      return;
    }

    // Verificar el filtro de grupo muscular
    const matchGrupoMuscular =
      grupoMuscular === "todos" ||
      (grupoMuscular === "agregados" && ejercicio.id_rutina !== null) ||
      ejercicio.grupo_muscular === grupoMuscular;

    // Verificar el filtro de búsqueda
    const matchBusqueda =
      !searchText ||
      normalizarTexto(ejercicio.nombre).includes(searchText);

    // Mostrar u ocultar el elemento según los filtros
    elemento.style.display = matchGrupoMuscular && matchBusqueda ? "" : "none";
  });
}


// Función para normalizar texto eliminando tildes y mayúsculas
function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function editarEjercicio(idEjercicio) {
  console.log("Editar ejercicio:", idEjercicio);

  // Obtener la rutina actual del localStorage
  const idRutina = localStorage.getItem("idRutina");

  if (!idRutina) {
    console.error("ID de rutina no encontrado en el localStorage");
    return;
  }

  // Llamar al backend para obtener series y repeticiones
  fetch(`obtener_series_repes.php?id_ejercicio=${idEjercicio}&id_rutina=${idRutina}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al obtener las series y repeticiones.");
      }
      return response.json();
    })
    .then(data => {
      if (!data.success) {
        console.error(data.message || "Error al obtener los datos.");
        return;
      }

      // Obtener el elemento correspondiente
      const ejercicioDiv = document.querySelector(`.elemento[data-id="${idEjercicio}"]`);

      if (!ejercicioDiv) {
        console.error("No se encontró el div del ejercicio con id:", idEjercicio);
        return;
      }

      // Cambiar la clase del div
      ejercicioDiv.className = "elemento-series-repes";

      // Reemplazar el contenido del div
      ejercicioDiv.innerHTML = `
        <div class="contenedor-titulo">
          <h2 class="titulo">${ejerciciosGlobal.find(e => e.id_ejercicio === idEjercicio).nombre}</h2>
        </div>
        <div class="contenedor-series-repes">
          <div class="series-repes">
            <span class="titulo-series-repes">Número de <br>series</span>
            <input type="number" id="series-${idEjercicio}" class="input-numero" value="${data.series}" placeholder="0">
          </div>
          <div class="series-repes">
            <span class="titulo-series-repes">Número de <br>repeticiones</span>
            <input type="number" id="repeticiones-${idEjercicio}" class="input-numero" value="${data.repeticiones}" placeholder="0">
          </div>
        </div>
        <button class="edit-button">
          <img class="icon-button" src="Icons/ICON-edit.svg">GUARDAR
        </button>
      `;

      // Agregar el evento para guardar cambios
      const guardarButton = ejercicioDiv.querySelector(".edit-button");
      guardarButton.addEventListener("click", () => guardarCambiosEjercicio(idEjercicio));
    })
    .catch(error => console.error("Error en la solicitud:", error));
}

function guardarCambiosEjercicio(idEjercicio) {
  console.log("Guardando cambios para el ejercicio:", idEjercicio);

  const inputSeries = document.getElementById(`series-${idEjercicio}`);
  const inputRepeticiones = document.getElementById(`repeticiones-${idEjercicio}`);

  if (!inputSeries || !inputRepeticiones) {
    console.error("No se encontraron los inputs de series o repeticiones");
    return;
  }

  const series = parseInt(inputSeries.value, 10);
  const repeticiones = parseInt(inputRepeticiones.value, 10);

  if (!series || !repeticiones) {
    console.error("Los valores de series o repeticiones no son válidos");
    return;
  }

  fetch("actualizar_series_repes.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_ejercicio: idEjercicio,
      id_rutina: localStorage.getItem("idRutina"),
      series: series,
      repeticiones: repeticiones,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al actualizar los datos");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Respuesta del servidor:", data);
      if (data.success) {
        console.log("Datos actualizados exitosamente");
        actualizarDivEjercicio(idEjercicio);
      } else {
        console.error("Error al actualizar los datos en el servidor");
      }
    })
    .catch((error) => console.error("Error en la solicitud:", error));
}


function removerEjercicio(idEjercicio) {
  console.log("Remover ejercicio:", idEjercicio);

  fetch("remover_ejercicio.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_ejercicio: idEjercicio,
      id_rutina: localStorage.getItem("idRutina"),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al eliminar el ejercicio");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Respuesta del servidor:", data);
      if (data.success) {
        console.log("Ejercicio eliminado exitosamente");
        
        // Elimina el ejercicio de la variable global
        ejerciciosGlobal = ejerciciosGlobal.map(e => 
          e.id_ejercicio === idEjercicio ? { ...e, id_rutina: null } : e
        );

        // Actualiza el div del ejercicio eliminado
        actualizarDivEjercicioARestaurar(idEjercicio);
      } else {
        console.error("Error al eliminar el ejercicio en el servidor");
      }
    })
    .catch((error) => console.error("Error en la solicitud:", error));
}

function actualizarDivEjercicioARestaurar(idEjercicio) {
  const ejercicio = ejerciciosGlobal.find(e => e.id_ejercicio === idEjercicio);

  if (!ejercicio) {
    console.error("No se encontró el ejercicio con id:", idEjercicio);
    return;
  }

  const ejercicioDiv = document.querySelector(`.elemento[data-id="${idEjercicio}"]`);

  if (!ejercicioDiv) {
    console.error("No se encontró el div del ejercicio con id:", idEjercicio);
    return;
  }

  // Cambia la clase del div
  ejercicioDiv.className = "elemento";

  // Reemplaza el contenido del div con la nueva estructura
  ejercicioDiv.innerHTML = `
    <div class="contenedor-titulo">
        <h2 class="titulo">${ejercicio.nombre}</h2>
    </div>

    <div class="contenedor">
        <div class="image-holder">
            <img class="imagen-superior" src="${ejercicio.imagenes.inicial}" alt="${ejercicio.nombre} - Posición inicial">
            <img class="imagen-inferior" src="${ejercicio.imagenes.final}" alt="${ejercicio.nombre} - Posición final">
        </div>

        <div class="caracterisicas-ejercicio">
            <h3>${ejercicio.nivel}</h3>
            <h4>${ejercicio.grupo_muscular}</h4>
            <div class="contenedor-parrafo">
                <p class="parrafo">${ejercicio.descripcion}</p>
            </div>
        </div>
    </div>
    <button class="add-button"><img src="Icons/ICON-add.svg">AGREGAR</button>
  `;

  const addButton = ejercicioDiv.querySelector(".add-button");
  addButton.addEventListener("click", () => agregarEjercicio(idEjercicio));
}



function agregarEjercicio(idEjercicio) {
  console.log("Agregar ejercicio:", idEjercicio);

  // Busca el elemento del ejercicio correspondiente
  const ejercicioDiv = document.querySelector(`.elemento[data-id="${idEjercicio}"]`);

  if (!ejercicioDiv) {
    console.error("No se encontró el elemento del ejercicio con id:", idEjercicio);
    return;
  }

  // Cambia la clase del div
  ejercicioDiv.classList.remove("elemento");
  ejercicioDiv.classList.add("elemento-series-repes");

  // Reemplaza el contenido del div con la nueva estructura
  ejercicioDiv.innerHTML = `
    <div class="contenedor-titulo">
        <h2 class="titulo">${ejerciciosGlobal.find(e => e.id_ejercicio === idEjercicio).nombre}</h2>
    </div>
    <div class="contenedor-series-repes">
        <div class="series-repes">
            <span class="titulo-series-repes">Número de <br>series</span>
            <input type="number" id="series-${idEjercicio}" class="input-numero" placeholder="0">
        </div>
        <div class="series-repes">
            <span class="titulo-series-repes">Número de <br>repeticiones</span>
            <input type="number" id="repeticiones-${idEjercicio}" class="input-numero" placeholder="0">
        </div>
    </div>
    <button class="add-button">
        <img src="Icons/ICON-add.svg">GUARDAR
    </button>
  `;

  const guardarButton = ejercicioDiv.querySelector(".add-button");
  guardarButton.addEventListener("click", () => guardarEjercicio(idEjercicio));
}

function guardarEjercicio(idEjercicio) {
  console.log("Guardando ejercicio con id:", idEjercicio);

  const inputSeries = document.getElementById(`series-${idEjercicio}`);
  const inputRepeticiones = document.getElementById(`repeticiones-${idEjercicio}`);

  if (!inputSeries || !inputRepeticiones) {
    console.error("No se encontraron los inputs de series o repeticiones");
    return;
  }

  const series = inputSeries.value;
  const repeticiones = inputRepeticiones.value;

  if (!series || !repeticiones) {
    console.error("Los valores de series o repeticiones están vacíos");
    return;
  }

  console.log(`Ejercicio ${idEjercicio}: ${series} series, ${repeticiones} repeticiones`);

  fetch("agregar_ejercicio.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_ejercicio: idEjercicio,
      series: parseInt(series, 10),
      repeticiones: parseInt(repeticiones, 10),
      id_rutina: localStorage.getItem("idRutina"),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al guardar el ejercicio");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Respuesta del servidor:", data);
      if (data.success) {
        console.log("Ejercicio guardado exitosamente");
        // Actualiza solo el div del ejercicio agregado
        actualizarDivEjercicio(idEjercicio, parseInt(series, 10), parseInt(repeticiones, 10));
      } else {
        console.error("Error al guardar el ejercicio en el servidor");
      }
    })
    .catch((error) => console.error("Error en la solicitud:", error));
}

function actualizarDivEjercicio(idEjercicio) {
  const ejercicio = ejerciciosGlobal.find(e => e.id_ejercicio === idEjercicio);

  if (!ejercicio) {
    console.error("No se encontró el ejercicio con id:", idEjercicio);
    return;
  }

  // Actualizar los datos en ejerciciosGlobal
  ejercicio.id_rutina = localStorage.getItem("idRutina");

  // Busca el elemento del ejercicio correspondiente
  const ejercicioDiv = document.querySelector(`.elemento-series-repes[data-id="${idEjercicio}"]`);

  if (!ejercicioDiv) {
    console.error("No se encontró el div del ejercicio con id:", idEjercicio);
    return;
  }

  // Cambia la clase del div
  ejercicioDiv.className = "elemento";

  // Reemplaza el contenido del div con la nueva estructura
  ejercicioDiv.innerHTML = `
    <div class="contenedor-titulo">
        <h2 class="titulo">${ejercicio.nombre}</h2>
    </div>

    <div class="contenedor">
        <div class="image-holder">
            <img class="imagen-superior" src="${ejercicio.imagenes.inicial}" alt="${ejercicio.nombre} - Posición inicial">
            <img class="imagen-inferior" src="${ejercicio.imagenes.final}" alt="${ejercicio.nombre} - Posición final">
        </div>

        <div class="caracterisicas-ejercicio">
            <h3>${ejercicio.nivel}</h3>
            <h4>${ejercicio.grupo_muscular}</h4>
            <div class="contenedor-parrafo">
                <p class="parrafo">${ejercicio.descripcion}</p>
            </div>
        </div>
    </div>
    <div class="boton-mixto">
        <button class="add-button-half"><img src="Icons/ICON-add.svg">EDITAR</button>
        <button class="remove-button"><img src="Icons/ICON-remover.svg">REMOVER</button>
    </div>
  `;

  // Agregar eventos a los botones
  const editButton = ejercicioDiv.querySelector(".add-button-half");
  const removeButton = ejercicioDiv.querySelector(".remove-button");

  editButton.addEventListener("click", () => editarEjercicio(idEjercicio));
  removeButton.addEventListener("click", () => removerEjercicio(idEjercicio));
}



const idRutina = localStorage.getItem("idRutina");
cargarEjercicios(idRutina);
