$(document).ready(function() {
    $('form').on('submit', function(e) {
        e.preventDefault();
        $('#error-messages').empty();

        var formData = new FormData(this);
        var valid = true;

        // Validation
        if (!$('#name').val().trim()) {
            valid = false;
            $('#error-messages').append('<p>Name is required.</p>');
        }

        if (!$('#email').val().trim()) {
            valid = false;
            $('#error-messages').append('<p>Email is required.</p>');
        }

        if (!$('#fname').val().trim()) {
            valid = false;
            $('#error-messages').append('<p>First name is required.</p>');
        }

        if (!$('#lname').val().trim()) {
            valid = false;
            $('#error-messages').append('<p>Last name is required.</p>');
        }

        if (!$('#contact').val().trim()) {
            valid = false;
            $('#error-messages').append('<p>Contact is required.</p>');
        }

        if (!$('#address').val().trim()) {
            valid = false;
            $('#error-messages').append('<p>Address is required.</p>');
        }

        if (valid) {
            $.ajax({
                url: '/api/profile', // Corrected route for the API
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    alert('Profile updated successfully');
                    window.location.reload();
                },
                error: function(xhr) {
                    var errors = xhr.responseJSON.errors;
                    for (var key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            $('#error-messages').append('<p>' + errors[key][0] + '</p>');
                        }
                    }
                }
            });
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profile-form');
    const errorMessages = document.getElementById('error-messages');
    const profilePicInput = document.getElementById('profile_image');
    const profilePic = document.getElementById('profile-pic');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulating form submission
        errorMessages.innerHTML = '';
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Saving...';

        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Save Changes';
            showNotification('Profile updated successfully!');
        }, 2000);
    });

    profilePicInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePic.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add smooth scrolling to form fields
    const formInputs = form.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
});