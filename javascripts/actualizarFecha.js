document.addEventListener("DOMContentLoaded", function () {
    const fechaActualElement = document.getElementById("fechaActual");
  
    if (fechaActualElement) {
      // Obtener la fecha actual
      const hoy = new Date();
  
      // Configurar las opciones para el formato de fecha
      const opcionesFormato = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
  
      // Formatear la fecha al estilo deseado
      const fechaFormateada = hoy.toLocaleDateString("es-ES", opcionesFormato);
  
      // Actualizar el contenido del elemento con la fecha formateada
      fechaActualElement.textContent = fechaFormateada;
    } else {
      console.error("No se encontró un elemento con el ID 'fechaActual'");
    }
  });