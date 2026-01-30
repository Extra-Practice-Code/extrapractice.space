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

        // Find the first block with an image
        let imageUrl = null;
        let blockTitle = '';
        let sourceUrl = 'https://www.are.na/extra-practice/xp-community-television';

        for (const block of data.data) {
            if (block.image) {
                // Prioritize hi-res images
                imageUrl = block.image.original?.url || block.image.large?.src || block.image.medium?.src || block.image.square?.src;
                if (imageUrl) {
                    blockTitle = block.title || 'XP Community Television';

                    // Get the source URL based on block type
                    if (block.source?.url) {
                        sourceUrl = block.source.url;
                    } else if (block.attachment?.url) {
                        sourceUrl = block.attachment.url;
                    }

                    console.log('Found image in block:', block.type, block.title);
                    console.log('Source URL:', sourceUrl);
                    break;
                }
            }
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
