jQuery(document).ready(function($) {
    var currentStep = 1;
    var registerUrl = $('#signupForm').data('register-url');
    var loginUrl = $('#signupForm').data('login-url');
    var checkEmailUrl = $('#signupForm').data('check-email-url');
    var checkUsernameUrl = $('#signupForm').data('check-username-url');
    var emailExists = false;
    var usernameExists = false;

    showStep(currentStep);

    function showStep(step) {
        $('.form-step').hide();
        $('#step-' + step).show();
    }

    function validateStep(step) {
        var isValid = true;
        $('#step-' + step + ' .form-control').each(function() {
            if (!$(this).val()) {
                isValid = false;
                $(this).siblings('.error-text').text('This field is required.');
            } else {
                $(this).siblings('.error-text').text('');
            }
        });

        if (step == 1) {
            var firstName = $('#inputFirstName').val();
            var lastName = $('#inputLastName').val();
            var namePattern = /^[a-zA-Z]+$/;

            if (!firstName) {
                isValid = false;
                $('#error-fname').text('First name is required.');
            } else if (!namePattern.test(firstName)) {
                isValid = false;
                $('#error-fname').text('First name must contain only letters.');
            } else {
                $('#error-fname').text('');
            }

            if (!lastName) {
                isValid = false;
                $('#error-lname').text('Last name is required.');
            } else if (!namePattern.test(lastName)) {
                isValid = false;
                $('#error-lname').text('Last name must contain only letters.');
            } else {
                $('#error-lname').text('');
            }
        }

        if (step == 2) {
            var contact = $('#inputContact').val();
            var contactPattern = /^[0-9]{11}$/;
            if (!contact) {
                isValid = false;
                $('#error-contact').text('Contact number is required.');
            } else if (!contactPattern.test(contact)) {
                isValid = false;
                $('#error-contact').text('Contact number must be exactly 11 digits.');
            } else {
                $('#error-contact').text('');
            }

            // Check email and username existence
            var email = $('#exampleInputEmail1').val();
            var username = $('#exampleInputUsername1').val();

            if (username) {
                $.ajax({
                    url: checkUsernameUrl,
                    type: 'POST',
                    async: false, // Ensure synchronous check
                    data: { name: username, _token: $('meta[name="csrf-token"]').attr('content') },
                    success: function(response) {
                        if (response.exists) {
                            $('#error-name').text('Username already exists.');
                            usernameExists = true;
                            isValid = false;
                        } else {
                            $('#error-name').text('');
                            usernameExists = false;
                        }
                    }
                });
            }

            if (email) {
                $.ajax({
                    url: checkEmailUrl,
                    type: 'POST',
                    async: false, // Ensure synchronous check
                    data: { email: email, _token: $('meta[name="csrf-token"]').attr('content') },
                    success: function(response) {
                        if (response.exists) {
                            $('#error-email').text('Email already exists.');
                            emailExists = true;
                            isValid = false;
                        } else {
                            $('#error-email').text('');
                            emailExists = false;
                        }
                    }
                });
            }

            if (emailExists || usernameExists) {
                showPopupMessage('error', 'Please use a unique username and email.');
            }
        }

        if (step == 3) {
            var password = $('#inputPassword').val();
            var confirmPassword = $('#inputConfirmPassword').val();
            if (password.length < 3 || password.length > 12) {
                isValid = false;
                $('#error-password').text('Password must be between 3 and 12 characters.');
            } else {
                $('#error-password').text('');
            }
            if (password !== confirmPassword) {
                isValid = false;
                $('#error-password-confirm').text('Passwords do not match.');
            } else {
                $('#error-password-confirm').text('');
            }
        }

        if (!isValid) {
            showPopupMessage('error', 'Please fix the errors below.');
        }

        return isValid;
    }

    $('.next-btn').click(function() {
        var nextStep = $(this).data('next-step');
        if (validateStep(currentStep)) {
            currentStep = nextStep;
            showStep(currentStep);
        }
    });

    $('.prev-btn').click(function() {
        var prevStep = $(this).data('prev-step');
        currentStep = prevStep;
        showStep(currentStep);
    });

    $('#signupForm').submit(function(e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
            var formData = new FormData(this);
            $.ajax({
                url: registerUrl,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                beforeSend: function() {
                    $('.loading-overlay').addClass('show');
                },
                success: function(response) {
                    $('.loading-overlay').removeClass('show');
                    if (response.success) {
                        showPopupMessage('warning', 'Signup successful. Please wait for the admin to change your role or confirm your registration.');
                        setTimeout(function() {
                            window.location.href = loginUrl;
                        }, 2000);
                    } else {
                        showPopupMessage('error', 'Please fix the errors below.');
                    }
                },
                error: function(xhr) {
                    $('.loading-overlay').removeClass('show');
                    var errors = xhr.responseJSON.errors;
                    for (var key in errors) {
                        $('#' + key).siblings('.error-text').text(errors[key][0]);
                    }
                    if (xhr.responseJSON.message) {
                        showPopupMessage('error', xhr.responseJSON.message);
                    }
                    showPopupMessage('error', 'Please fix the errors below.');
                }
            });
        }
    });

    // Toggle password visibility
    $('.toggle-password').click(function() {
        var input = $($(this).attr('toggle'));
        if (input.attr('type') == 'password') {
            input.attr('type', 'text');
            $(this).find('i').removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            input.attr('type', 'password');
            $(this).find('i').removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // Move the eye icon inside the input box
    $('.password-input-wrapper').append($('.toggle-password'));

    // Profile image preview
    $('#inputProfileImage').change(function() {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#profileImagePreview').attr('src', e.target.result).show();
            $('.profile-image-circle i').hide();
        };
        reader.readAsDataURL(this.files[0]);
    });

    // Check email and username uniqueness on blur
    $('#exampleInputUsername1').blur(function() {
        var username = $(this).val();
        if (username) {
            $.post(checkUsernameUrl, { name: username, _token: $('meta[name="csrf-token"]').attr('content') }, function(response) {
                if (response.exists) {
                    $('#error-name').text('Username already exists.');
                    usernameExists = true;
                } else {
                    $('#error-name').text('');
                    usernameExists = false;
                }
            });
        }
    });

    $('#exampleInputEmail1').blur(function() {
        var email = $(this).val();
        if (email) {
            $.post(checkEmailUrl, { email: email, _token: $('meta[name="csrf-token"]').attr('content') }, function(response) {
                if (response.exists) {
                    $('#error-email').text('Email already exists.');
                    emailExists = true;
                } else {
                    $('#error-email').text('');
                    emailExists = false;
                }
            });
        }
    });

    function showPopupMessage(type, message) {
        var popup = $('#' + type + '-popup');
        popup.find('span').text(message);
        popup.addClass('show');
        setTimeout(function() {
            popup.removeClass('show');
        }, 3000);
    }

    // Hide all popup messages initially
    $('.popup-message').removeClass('show');
});
