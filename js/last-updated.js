// Fetch last commit date from GitHub API
fetch('https://api.github.com/repos/Extra-Practice-Code/Extra-Practice/commits/main')
    .then(response => response.json())
    .then(data => {
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
    document.getElementById('last-updated').textContent = formattedDate;
    document.getElementById('last-updated-time').textContent = formattedTime;
    document.getElementById('last-updated-author').textContent = authorName;
})
.catch(error => console.error('Error fetching last commit date:', error));