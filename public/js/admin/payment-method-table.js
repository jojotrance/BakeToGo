$(document).ready(function() {
    let paymentMethods = [];

    // Fetch payment methods data
    $.ajax({
        url: "/api/admin/payment-methods",
        method: 'GET',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            paymentMethods = response.data;
        },
        error: function(xhr, status, error) {
            console.error('Failed to fetch payment methods:', error);
        }
    });

    // Initialize DataTable for payment methods
    var paymentMethodTable = $('#payment_method_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/api/admin/payment-methods",
            type: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataSrc: function(json) {
                paymentMethods = json.data;
                return json.data;
            },
            error: function(xhr, status, error) {
                showNotification('Failed to load payment methods. Please try again.', 'error');
            }
        },
        columns: [
            { data: 'id', name: 'id' },
            { data: 'payment_name', name: 'payment_name' },
            {
                data: 'image',
                name: 'image',
                render: function(data) {
                    return data ? '<img src="' + data + '" class="img-thumbnail" width="50" />' : 'No Image';
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    return '<button type="button" class="edit-payment-method btn btn-primary btn-sm" data-id="' + row.id + '">Edit</button> ' +
                        '<button type="button" class="delete-payment-method btn btn-danger btn-sm" data-id="' + row.id + '">Delete</button>';
                }
            }
        ],
        responsive: true,
        lengthMenu: [10, 25, 50, 75, 100],
        pageLength: 10,
        language: {
            searchPlaceholder: "Search payment methods",
            search: ""
        }
    });

    // Payment method name input validation
    $('#payment_method_name').on('input', function() {
        var paymentMethodName = $(this).val().trim().toLowerCase();
        if (paymentMethodName === '') {
            $('#payment_method_name_error').text('');
            return;
        }

        var exists = paymentMethods.some(function(paymentMethod) {
            return paymentMethod.payment_name.toLowerCase() === paymentMethodName;
        });

        if (exists && $('#action_button_payment_method').text() !== 'Update') {
            $('#payment_method_name_error').text('Payment method with this name already exists.');
        } else {
            $('#payment_method_name_error').text('');
        }
    });

    // Create payment method button click
    $(document).on('click', '#create_payment_method', function() {
        $('#payment_method_form')[0].reset();
        $('#modal_title_payment_method').text('Add New Payment Method');
        $('#action_button_payment_method').text('Create');
        $('#payment_method_image').attr('required', true);
        $('.text-danger').text('');
        $('#image_preview').hide();
        $('#payment_method_modal').modal('show');
    });

    // Payment method form submit
    $('#payment_method_form').on('submit', function(event) {
        event.preventDefault();
        if (!validateForm()) return;

        var action_url = $('#action_button_payment_method').text() === 'Update' ?
                        "/api/admin/payment-methods/" + $('#hidden_id_payment_method').val() :
                        "/api/admin/payment-methods";
        var method = $('#action_button_payment_method').text() === 'Update' ? 'POST' : 'POST';
        var formData = new FormData(this);

        if ($('#action_button_payment_method').text() === 'Update') {
            formData.append('_method', 'PUT');
        }

        $.ajax({
            url: action_url,
            method: method,
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.data) {
                    $('#payment_method_modal').modal('hide');
                    paymentMethodTable.ajax.reload(null, false);
                    showNotification('Payment method has been successfully ' + ($('#action_button_payment_method').text() === 'Update' ? 'updated' : 'created') + '!', 'success');
                    $('#payment_method_form')[0].reset();
                    paymentMethods.push(response.data);
                } else {
                    showModalNotification(response.error || 'An error occurred', 'error');
                }
            },
            error: function(xhr, status, error) {
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    displayValidationErrors(xhr.responseJSON.error);
                } else {
                    showModalNotification('An error occurred. Please try again.', 'error');
                }
            }
        });
    });

    function displayValidationErrors(errors) {
        for (var key in errors) {
            if (errors.hasOwnProperty(key)) {
                $('#' + key + '_error').text(errors[key][0]);
            }
        }
    }

    // Edit payment method button click
    $(document).on('click', '.edit-payment-method', function() {
        var id = $(this).data('id');
        $('#payment_method_form').find('.text-danger').html('');

        $.ajax({
            url: "/api/admin/payment-methods/" + id,
            method: 'GET',
            dataType: 'json',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.data) {
                    var paymentMethod = response.data;
                    $('#payment_method_name').val(paymentMethod.payment_name || '');
                    $('#hidden_id_payment_method').val(paymentMethod.id || '');
                    if (paymentMethod.image) {
                        $('#image_preview').attr('src', paymentMethod.image).show();
                    } else {
                        $('#image_preview').hide();
                    }
                    $('#modal_title_payment_method').text('Edit Payment Method');
                    $('#action_button_payment_method').text('Update');
                    $('#payment_method_image').attr('required', false);
                    $('#payment_method_modal').modal('show');
                } else {
                    showModalNotification('Failed to load payment method details.', 'error');
                }
            },
            error: function(xhr, status, error) {
                showModalNotification('Failed to load payment method details.', 'error');
            }
        });
    });

    // Delete payment method button click
    $(document).on('click', '.delete-payment-method', function() {
        var id = $(this).data('id');
        if (!id) {
            showNotification('Invalid payment method ID. Please try again.', 'error');
            return;
        }
        $('#confirm_message_payment_method').text('Are you sure you want to delete this payment method?');
        $('#confirm_button_payment_method').text('Delete');
        $('#confirm_modal_payment_method').modal('show');

        $('#confirm_button_payment_method').off('click').on('click', function() {
            $('#confirm_modal_payment_method').modal('hide');
            $.ajax({
                url: "/api/admin/payment-methods/" + id,
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    paymentMethodTable.ajax.reload(null, false);
                    showNotification('Payment method has been successfully deleted!', 'success');
                },
                error: function(xhr, status, error) {
                    showNotification('An error occurred while deleting the payment method. Please try again.', 'error');
                }
            });
        });
    });

    // Export payment methods to Excel
    $('#export_excel_payment_methods').on('click', function() {
        console.log('Export to Excel button clicked');
        var data = paymentMethodTable.rows({ search: 'applied' }).data().toArray();
        var formattedData = [];

        var loadImagePromises = data.map(function(paymentMethod) {
            return loadImage(paymentMethod.image).then(function(base64Image) {
                formattedData.push({
                    ID: paymentMethod.id,
                    Name: paymentMethod.payment_name,
                    Image: base64Image
                });
            });
        });

        Promise.all(loadImagePromises).then(function() {
            var ws = XLSX.utils.json_to_sheet(formattedData, { skipHeader: false });
            
            // Adjust column widths
            ws['!cols'] = [{ wpx: 50 }, { wpx: 200 }, { wpx: 300 }];
            
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "PaymentMethods");
            XLSX.writeFile(wb, "payment_methods.xlsx");
        });
    });

    function loadImage(url) {
        return new Promise((resolve, reject) => {
            if (!url) {
                resolve('No Image');
                return;
            }

            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = function() {
                resolve('No Image');
            };
            img.src = url;
        });
    }

    function showNotification(message, type) {
        var alertDiv = type === 'success' ? $('#success-alert') : $('#error-alert');
        var messageSpan = type === 'success' ? $('#success-message') : $('#error-message');
        messageSpan.text(message);
        alertDiv.fadeIn();

        setTimeout(function() {
            alertDiv.fadeOut();
        }, 4000);
    }

    function showModalNotification(message, type) {
        var alertDiv = type === 'success' ? '<div class="alert alert-success">' : '<div class="alert alert-danger">';
        alertDiv += message + '</div>';
        $('#payment_method_modal .modal-body').prepend(alertDiv);

        setTimeout(function() {
            $('#payment_method_modal .alert').remove();
        }, 4000);
    }

    function validateForm() {
        let isValid = true;
        $('.text-danger').text('');

        var paymentMethodNameElement = $('#payment_method_name');
        if (!paymentMethodNameElement.val()) {
            $('#payment_method_name_error').text('Name is required');
            isValid = false;
        }

        var paymentMethodName = paymentMethodNameElement.val().trim().toLowerCase();
        var exists = paymentMethods.some(function(paymentMethod) {
            return paymentMethod.payment_name.toLowerCase() === paymentMethodName;
        });

        if (exists && $('#action_button_payment_method').text() !== 'Update') {
            $('#payment_method_name_error').text('Payment method with this name already exists.');
            isValid = false;
        }

        if ($('#action_button_payment_method').text() === 'Create' && !$('#payment_method_image').val().trim()) {
            $('#payment_method_image_error').text('Image is required');
            isValid = false;
        }

        return isValid;
    }

    $('#payment_method_image').on('change', function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#image_preview').attr('src', e.target.result).show();
            }
            reader.readAsDataURL(file);
        }
    });
});
