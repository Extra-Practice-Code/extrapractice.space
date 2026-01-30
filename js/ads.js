// List of all ad images
const adImages = [
    'images/ads/1_emma-s-advertisment-for-elliott.jpg',
    'images/ads/3_jack-s-advertisement-for-emma.jpg',
    'images/ads/3_jack-s-advertisement-for-emma_1.jpg',
    'images/ads/5_kirsten-s-advertisement-for-gijs.jpg',
    'images/ads/7_ben-s-advertisement-for-kirsten.jpg',
    'images/ads/9_elliott-s-advertisement-for-ben.jpg',
    'images/ads/11_gijs-advertisement-for-jack.jpg'
];

let lastIndex = 0;

function getNextAd() {
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * adImages.length);
    } while (nextIndex === lastIndex && adImages.length > 1);

    lastIndex = nextIndex;
    return adImages[nextIndex];
}

function changeAd() {
    const container = document.querySelector('#ads');
    const currentImg = document.querySelector('#ad-image');
    if (!container || !currentImg) return;

    const nextAd = getNextAd();

    // Create new image element for the next ad
    const newImg = document.createElement('img');
    newImg.src = nextAd;
    newImg.alt = 'Advertisement';
    newImg.style.position = 'absolute';
    newImg.style.top = '100%';
    newImg.style.left = '0';
    newImg.style.width = '100%';
    newImg.style.objectFit = 'contain';

    container.appendChild(newImg);

    // Start the roll animation
    setTimeout(() => {
        currentImg.classList.add('scroll-roll');
        newImg.classList.add('scroll-roll');

        // After animation, clean up
        setTimeout(() => {
            container.removeChild(currentImg);
            newImg.removeAttribute('style');
            newImg.classList.remove('scroll-roll');
            newImg.id = 'ad-image';
        }, 1000);
    }, 50);
}

// Set random initial ad
function setInitialAd() {
    const img = document.querySelector('#ad-image');
    if (!img) return;

    const randomIndex = Math.floor(Math.random() * adImages.length);
    lastIndex = randomIndex;
    img.src = adImages[randomIndex];
}

// Start the ad rotation after page loads
window.addEventListener('DOMContentLoaded', () => {
    setInitialAd();
    setInterval(changeAd, 8000);
});
