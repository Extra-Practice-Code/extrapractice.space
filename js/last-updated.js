// Fetch last commit date from GitHub API
fetch('https://api.github.com/repos/Extra-Practice-Code/Extra-Practice/commits/main')
    .then(response => {
        console.log('GitHub API response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('GitHub API full response:', data);

        // Check if data has the expected structure
        if (!data || !data.commit || !data.commit.committer) {
            console.error('GitHub API response missing expected data:', data);
            return;
        }

        const lastCommitDate = new Date(data.commit.committer.date);
        // Format date
        const formattedDate = lastCommitDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '.');

        // Format time
        const formattedTime = lastCommitDate.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Get author name
        const authorName = data.commit.author.name;

        // Update DOM elements
        const lastUpdatedEl = document.getElementById('last-updated');
        const lastUpdatedTimeEl = document.getElementById('last-updated-time');
        const lastUpdatedAuthorEl = document.getElementById('last-updated-author');

        if (lastUpdatedEl) lastUpdatedEl.textContent = formattedDate;
        if (lastUpdatedTimeEl) lastUpdatedTimeEl.textContent = formattedTime;
        if (lastUpdatedAuthorEl) lastUpdatedAuthorEl.textContent = authorName;
    })
    .catch(error => {
        console.error('Error fetching last commit date:', error);
        // Don't let this error break other scripts
    });