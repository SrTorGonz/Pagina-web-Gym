window.onload = function() {
    // Obtener el parámetro "email" de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    // Colocar el correo en el campo de entrada si existe
    if (email) {
        const emailInput = document.getElementById('email'); // Asegúrate de que el input tenga este ID en registro.html
        if (emailInput) {
            emailInput.value = email;
        }
    }
};
