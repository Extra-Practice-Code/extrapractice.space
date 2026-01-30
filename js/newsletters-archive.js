(function() {
    // Are.na API configuration
    const api = 'https://api.are.na/v3/channels/';
    const channelSlug = 'xp-newsletters';

    let allNewsletters = [];

    // Function to fetch a page of contents
    async function fetchPage(page = 1, per = 100) {
        const url = `${api}${channelSlug}/contents?page=${page}&per=${per}&sort=position_desc`;
        console.log('Fetching:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Cache-Control': 'no-cache' }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching newsletters:', error);
            throw error;
        }
    }

    // Function to render newsletters
    function renderNewsletters() {
        const container = document.querySelector('#newsletters-list');
        if (!container) return;

        if (allNewsletters.length === 0) {
            container.innerHTML = '<p>Loading newsletters...</p>';
            return;
        }

        let html = '<p class="archive-intro">This is an archive of all of our newsletters. You can also browse them on <a href="https://www.are.na/extra-practice/xp-newsletters">this Are.na channel</a>.</p>';
        html += '<div class="newsletter-grid">';

        allNewsletters.forEach(newsletter => {
            // Get URL based on block type
            let url = '#';
            if (newsletter.type === 'Link' && newsletter.source?.url) {
                url = newsletter.source.url;
            } else if (newsletter.type === 'Attachment' && newsletter.attachment?.url) {
                url = newsletter.attachment.url;
            } else if (newsletter.type === 'Channel' && newsletter._links?.self) {
                url = `https://www.are.na${newsletter._links.self}`;
            }

            // Get image URL
            let imageUrl = '';
            if (newsletter.image?.large?.src) {
                imageUrl = newsletter.image.large.src;
            } else if (newsletter.image?.medium?.src) {
                imageUrl = newsletter.image.medium.src;
            } else if (newsletter.image?.square?.src) {
                imageUrl = newsletter.image.square.src;
            } else if (newsletter.image?.small?.src) {
                imageUrl = newsletter.image.small.src;
            }

            const title = newsletter.title || 'Untitled';

            html += `
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="newsletter-item">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${title}">` : '<div class="no-image"></div>'}
                    <div class="newsletter-caption">${title}</div>
                </a>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // Main function to fetch all newsletters
    async function fetchAllNewsletters() {
        const container = document.querySelector('#newsletters-list');

        try {
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const data = await fetchPage(page, 100);
                if (!data || !data.data) {
                    console.log('No data returned or no data.data');
                    break;
                }

                console.log(`Page ${page}: ${data.data.length} items`);

                // Push all blocks, not just specific types
                if (Array.isArray(data.data)) {
                    allNewsletters.push(...data.data);
                }

                hasMore = data.meta && data.meta.has_more_pages;
                page++;
            }

            console.log(`Loaded ${allNewsletters.length} newsletters`);

            if (allNewsletters.length === 0 && container) {
                container.innerHTML = '<p>No newsletters found.</p>';
                return;
            }

            renderNewsletters();
        } catch (error) {
            console.error('Error loading newsletters:', error);
            if (container) {
                container.innerHTML = `<p>Error loading newsletters: ${error.message}</p>`;
            }
        }
    }

    // Start fetching when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchAllNewsletters);
    } else {
        fetchAllNewsletters();
    }
})();
