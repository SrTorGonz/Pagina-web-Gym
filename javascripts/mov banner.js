let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function nextImage() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevImage() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

function autoSlide() {
    nextImage();
    setTimeout(autoSlide, 3000); // Cambia la imagen cada 3 segundos
}

// Muestra la primera imagen inicialmente
showSlide(currentSlide);

// Inicia el cambio automático de imágenes
autoSlide();
