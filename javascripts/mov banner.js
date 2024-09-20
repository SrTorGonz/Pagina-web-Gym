let index = 0;
const slides = document.querySelector('.image-slider');
const totalSlides = slides.querySelectorAll('img').length;

document.querySelector('.next').addEventListener('click', () => {
    index = (index + 1) % totalSlides;
    slides.style.transform = `translateX(-${index * 100}%)`;
});

document.querySelector('.prev').addEventListener('click', () => {
    index = (index - 1 + totalSlides) % totalSlides;
    slides.style.transform = `translateX(-${index * 100}%)`;
});

setInterval(() => {
    index = (index + 1) % totalSlides;
    slides.style.transform = `translateX(-${index * 100}%)`;
}, 5000);
