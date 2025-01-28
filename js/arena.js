// Get query string
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
let channel_title = 'activity-efz52cmnw4o';

// Are.na's base API url
const api = 'https://api.are.na/v2/channels/';

let allImages = [];

// Function to fetch a page of contents
async function fetchPage(page = 1, per = 100) {
    try {
        const response = await fetch(`${api}${channel_title}/contents?page=${page}&per=${per}&direction=desc`, {
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' }
        });
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
    
    imgElement.src = nextImage.image.display.url;
    captionElement.innerHTML = nextImage.title || 'Untitled';

    setTimeout(showRandomImage, 4000);
}

// Main function to fetch all contents
async function fetchAllContents() {
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
        const data = await fetchPage(page, 20);
        if (!data) break;
        
        data.contents.forEach(block => {
            if (block.class == 'Image') {
                allImages.push(block);
            }
        });
        
        hasMore = data.contents.length === 20;
        page++;
    }
    
    console.log(`Loaded ${allImages.length} images`);
    showRandomImage();
}

// Start fetching contents
fetchAllContents();