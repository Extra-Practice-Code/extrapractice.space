function copyEmail() {
    // Get the email address
    var email = 'mail@extrapractice.space';

    // Create a temporary input element
    var tempInput = document.createElement('input');
    tempInput.value = email;
    document.body.appendChild(tempInput);

    // Select and copy the email address
    tempInput.select();
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    // Change the button text to indicate successful copy
    var button = document.getElementById('copy-btn');
    button.innerText = 'Copied "mail@extrapractice.space"';

    // Revert the button text after 3 seconds (adjust as needed)
    setTimeout(function() {
        button.innerText = 'Or copy our email!';
    }, 3000);
}