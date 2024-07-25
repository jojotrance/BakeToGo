// public/js/customer/profile.js
import $ from 'jquery';

$(document).ready(function() {
    const form = $('#profile-form');
    const errorMessages = $('#error-messages');
    const profilePicInput = $('#profile_image');
    const profilePic = $('#profile-pic');

    form.on('submit', function(e) {
        e.preventDefault();
        errorMessages.empty().hide();

        const formData = new FormData(this);
        let valid = true;

        // Validation
        if (!$('#fname').val().trim()) {
            valid = false;
            errorMessages.append('<p>First name is required.</p>');
        }

        if (!$('#lname').val().trim()) {
            valid = false;
            errorMessages.append('<p>Last name is required.</p>');
        }

        if (!$('#email').val().trim()) {
            valid = false;
            errorMessages.append('<p>Email is required.</p>');
        }

        if (!$('#contact').val().trim()) {
            valid = false;
            errorMessages.append('<p>Contact is required.</p>');
        }

        if (!$('#address').val().trim()) {
            valid = false;
            errorMessages.append('<p>Address is required.</p>');
        }

        if (valid) {
            $.ajax({
                url: form.attr('action'),
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    alert('Profile updated successfully');
                    window.location.reload();
                },
                error: function(xhr) {
                    const errors = xhr.responseJSON.errors;
                    for (let key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            errorMessages.append('<p>' + errors[key][0] + '</p>');
                        }
                    }
                    errorMessages.show();
                }
            });
        } else {
            errorMessages.show();
        }
    });

    profilePicInput.on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePic.attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });
});
