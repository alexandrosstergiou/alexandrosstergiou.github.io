// This file contains the JavaScript functionality for the TRANSPORTER project video carousels.

document.addEventListener("DOMContentLoaded", function() {
    // Initialize carousels for each figure
    initializeCarousel('carousel-8', ['videos_gigs8-11/8_video1.mp4', 'videos_gigs8-11/8_video2.mp4']);
    initializeCarousel('carousel-9', ['videos_gigs8-11/9_video1.mp4']);
    initializeCarousel('carousel-10', ['videos_gigs8-11/10_video1.mp4']);
    initializeCarousel('carousel-11', ['videos_gigs8-11/11_video1.mp4']);
});

function initializeCarousel(carouselId, videoFiles) {
    const carouselContainer = document.getElementById(carouselId);
    videoFiles.forEach((videoFile, index) => {
        const videoElement = document.createElement('video');
        videoElement.src = videoFile;
        videoElement.controls = true;
        videoElement.classList.add('carousel-video');

        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
            carouselItem.classList.add('active');
        }
        carouselItem.appendChild(videoElement);
        carouselContainer.appendChild(carouselItem);
    });

    // Add carousel controls if needed
    addCarouselControls(carouselContainer);
}

function addCarouselControls(carouselContainer) {
    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.onclick = () => changeSlide(carouselContainer, -1);
    
    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.onclick = () => changeSlide(carouselContainer, 1);
    
    carouselContainer.appendChild(prevButton);
    carouselContainer.appendChild(nextButton);
}

function changeSlide(carouselContainer, direction) {
    const items = carouselContainer.getElementsByClassName('carousel-item');
    let currentIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
    items[currentIndex].classList.remove('active');
    
    currentIndex = (currentIndex + direction + items.length) % items.length;
    items[currentIndex].classList.add('active');
}