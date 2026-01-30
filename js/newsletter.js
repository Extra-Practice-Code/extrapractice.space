// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab contents
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    const clickedButton = document.querySelector(`button[onclick*="${tabName}"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

// Newsletter form submission
function handleNewsletterSubmit() {
    const form = document.getElementById('newsletter-subscribe-form');
    const messageDiv = document.getElementById('newsletter-message');

    if (!form || !messageDiv) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');

        // Disable button during submission
        submitButton.disabled = true;
        submitButton.textContent = 'Subscribing...';

        // Hide previous message
        messageDiv.style.display = 'none';

        try {
            await fetch(form.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // MailerLite doesn't support CORS
            });

            // With no-cors, we can't read the response, so assume success
            messageDiv.textContent = 'Subscribed!';
            messageDiv.className = 'newsletter-message success';
            messageDiv.style.display = 'block';
            form.reset();

        } catch (error) {
            messageDiv.textContent = 'Something went wrong. Please try again.';
            messageDiv.className = 'newsletter-message error';
            messageDiv.style.display = 'block';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Subscribe';
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleNewsletterSubmit);
} else {
    handleNewsletterSubmit();
}

// Make function globally available
window.switchTab = switchTab;
