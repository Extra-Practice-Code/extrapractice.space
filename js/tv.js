(function() {
    // Are.na API configuration
    const api = 'https://api.are.na/v3/channels/';
    const channelSlug = 'xp-community-television';

    // Function to fetch the latest content
    async function fetchLatestContent() {
        try {
            const response = await fetch(`${api}${channelSlug}/contents?page=1&per=10&sort=position_desc`, {
                method: 'GET',
                headers: { 'Cache-Control': 'no-cache' }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('TV API response:', data);
            return data;
        } catch (error) {
            console.error('Error fetching TV content:', error);
            return null;
        }
    }

    // Function to display the latest image
    async function displayLatestImage() {
        const imgElement = document.querySelector('#tv-image');
        const linkElement = document.querySelector('#tv-link');
        if (!imgElement || !linkElement) return;

        const data = await fetchLatestContent();

        if (!data || !data.data || data.data.length === 0) {
            console.log('No TV content found');
            return;
        }

        // Collect all blocks with images
        const blocksWithImages = [];
        for (const block of data.data) {
            if (block.image) {
                const imageUrl = block.image.original?.url || block.image.large?.src || block.image.medium?.src || block.image.square?.src;
                if (imageUrl) {
                    blocksWithImages.push(block);
                }
            }
        }

        // Pick a random block from those with images
        let imageUrl = null;
        let blockTitle = '';
        let sourceUrl = 'https://www.are.na/extra-practice/xp-community-television';

        if (blocksWithImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * blocksWithImages.length);
            const selectedBlock = blocksWithImages[randomIndex];

            imageUrl = selectedBlock.image.original?.url || selectedBlock.image.large?.src || selectedBlock.image.medium?.src || selectedBlock.image.square?.src;
            blockTitle = selectedBlock.title || 'XP Community Television';

            // Get the source URL based on block type
            if (selectedBlock.source?.url) {
                sourceUrl = selectedBlock.source.url;
            } else if (selectedBlock.attachment?.url) {
                sourceUrl = selectedBlock.attachment.url;
            }

            console.log('Selected random image from block:', selectedBlock.type, selectedBlock.title);
            console.log('Source URL:', sourceUrl);
        }

        if (imageUrl) {
            imgElement.src = imageUrl;
            linkElement.href = sourceUrl;
            console.log('Loaded TV image:', imageUrl);
            console.log('Updated link to:', sourceUrl);
        } else {
            console.log('No images found in first 10 blocks');
        }
    }

    // Load content when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', displayLatestImage);
    } else {
        displayLatestImage();
    }
})();
