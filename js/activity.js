// Get query string
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
let channel_title = 'activity-efz52cmnw4o';

// Are.na's base API url
const api = 'https://api.are.na/v3/channels/';

let allImages = [];

// Function to fetch a page of contents
async function fetchPage(page = 1, per = 100) {
    try {
        const response = await fetch(`${api}${channel_title}/contents?page=${page}&per=${per}&sort=created_at_desc`, {
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}

function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * allImages.length);
    return allImages[randomIndex];
}

function showRandomImage() {
    if (allImages.length === 0) return;

    const nextImage = getRandomImage();
    const imgElement = document.querySelector('#activity-image');
    const captionElement = document.querySelector('figcaption .inner');

    // v3 API uses different image structure
    const imageUrl = nextImage.image?.large?.src || nextImage.image?.original?.src || nextImage.image?.display?.url;

    // Preload the image before updating
    const preloadImg = new Image();
    preloadImg.onload = () => {
        // Update both image and caption together once image is loaded
        imgElement.src = imageUrl;
        captionElement.innerHTML = nextImage.title || 'Untitled';

        // Schedule next image change
        setTimeout(showRandomImage, 4000);
    };
    preloadImg.src = imageUrl;
}

// Main function to fetch all contents
async function fetchAllContents() {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const data = await fetchPage(page, 100);
        if (!data || !data.data) break;

        data.data.forEach(block => {
            if (block.type === 'Image') {
                allImages.push(block);
            }
        });

        hasMore = data.meta && data.meta.has_more_pages;
        page++;
    }

    console.log(`Loaded ${allImages.length} images`);
    showRandomImage();
}

// Start fetching contents
fetchAllContents();