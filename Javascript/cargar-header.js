// Función para cargar el archivo HeaderGeneral.html en el elemento con el id "header"
function loadHeader() {
    fetch('HeaderPreregistro.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo.');
            }
            return response.text(); // Devuelve el contenido como texto
        })
        .then(data => {
            document.getElementById('header').innerHTML = data; // Inserta el contenido en el div con id="header"
        })
        .catch(error => {
            console.error('Error al cargar el header:', error);
        });
}

// Llama a la función cuando se haya cargado el DOM
document.addEventListener('DOMContentLoaded', loadHeader);