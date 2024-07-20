$(document).ready(function() {
    let suppliers = [];

    // Fetch suppliers data
    $.ajax({
        url: "/api/suppliers",
        method: 'GET',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            suppliers = response.data;
        },
        error: function(xhr, status, error) {
            console.error('Failed to fetch suppliers:', error);
        }
    });

    // Initialize DataTable for suppliers
    var supplierTable = $('#supplier_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/api/suppliers",
            type: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataSrc: function(json) {
                suppliers = json.data;
                return json.data;
            },
            error: function(xhr, status, error) {
                showNotification('Failed to load suppliers. Please try again.', 'error');
            }
        },
        columns: [
            { data: 'id', name: 'id' },
            { data: 'supplier_name', name: 'supplier_name' },
            { 
                data: 'image', 
                name: 'image', 
                render: function(data) {
                    return data ? '<img src="/storage/' + data + '" class="img-thumbnail" width="50" />' : 'No Image';
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, full, meta) {
                    return '<button type="button" class="edit-supplier btn btn-primary btn-sm" data-id="' + full.id + '">Edit</button> ' +
                           '<button type="button" class="delete-supplier btn btn-danger btn-sm" data-id="' + full.id + '">Delete</button>';
                }
            }
        ],
        responsive: true,
        lengthMenu: [10, 25, 50, 75, 100],
        pageLength: 10,
        language: {
            searchPlaceholder: "Search suppliers",
            search: ""
        }
    });

    // Supplier name input validation
    $('#supplier_name').on('input', function() {
        var supplierName = $(this).val().trim().toLowerCase();
        if (supplierName === '') {
            $('#supplier_name_error').text('');
            return;
        }

        var exists = suppliers.some(function(supplier) {
            return supplier.supplier_name.toLowerCase() === supplierName;
        });

        if (exists && $('#action_button_supplier').text() !== 'Update') {
            $('#supplier_name_error').text('Supplier with this name already exists.');
        } else {
            $('#supplier_name_error').text('');
        }
    });

    // Create supplier button click
    $(document).on('click', '#create_supplier', function() {
        $('#supplier_form')[0].reset();
        $('#modal_title_supplier').text('Add New Supplier');
        $('#action_button_supplier').text('Create');
        $('#image').attr('required', true);
        $('.text-danger').text('');
        $('#supplier_modal').modal('show');
    });

    // Supplier form submit
    $('#supplier_form').on('submit', function(event) {
        event.preventDefault();
        if (!validateForm()) return;

        var action_url = $('#action_button_supplier').text() === 'Update' ? 
                        "/api/suppliers/" + $('#hidden_id_supplier').val() : 
                        "/api/suppliers";
        var method = $('#action_button_supplier').text() === 'Update' ? 'POST' : 'POST';
        var formData = new FormData(this);

        if ($('#action_button_supplier').text() === 'Update') {
            formData.append('_method', 'PUT');
        }

        console.log('Form URL:', action_url);
        console.log('Form Method:', method);

        $.ajax({
            url: action_url,
            method: method,
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.message) {
                    $('#supplier_modal').modal('hide');
                    supplierTable.ajax.reload(null, false);
                    showNotification(data.message, 'success');
                    $('#supplier_form')[0].reset();
                    suppliers.push(data.supplier);
                } else {
                    showModalNotification(data.error || 'An error occurred', 'error');
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

    // Edit supplier button click
    $(document).on('click', '.edit-supplier', function() {
        var id = $(this).data('id');
        console.log('Edit supplier ID:', id);
        $('#supplier_form').find('.text-danger').html('');

        $.ajax({
            url: "/api/suppliers/" + id,
            method: 'GET',
            dataType: 'json',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.data) {
                    var supplier = response.data;
                    $('#supplier_name').val(supplier.supplier_name || '');
                    $('#hidden_id_supplier').val(supplier.id || '');
                    console.log('Supplier ID set in form:', supplier.id);
                    if (supplier.image) {
                        $('#image_preview').attr('src', '/storage/' + supplier.image).show();
                    } else {
                        $('#image_preview').hide();
                    }
                    $('#modal_title_supplier').text('Edit Supplier');
                    $('#action_button_supplier').text('Update');
                    $('#image').attr('required', false);
                    $('#supplier_modal').modal('show');
                } else {
                    showModalNotification('Failed to load supplier details.', 'error');
                }
            },
            error: function(xhr, status, error) {
                showModalNotification('Failed to load supplier details.', 'error');
            }
        });
    });

    // Delete supplier button click
    $(document).on('click', '.delete-supplier', function() {
        var id = $(this).data('id');
        console.log('Delete supplier ID:', id);
        if (!id) {
            showModalNotification('Invalid supplier ID. Please try again.', 'error');
            return;
        }
        $('#confirm_message').text('Are you sure you want to delete this supplier?');
        $('#confirm_button').text('Delete');
        $('#confirmModal').modal('show');
    
        $('#confirm_button').off('click').on('click', function() {
            $('#confirmModal').modal('hide');
            $.ajax({
                url: "/api/suppliers/" + id,
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(data) {
                    supplierTable.ajax.reload(null, false);
                    showNotification('Supplier has been successfully deleted!', 'success');
                },
                error: function(xhr, status, error) {
                    showNotification('An error occurred while deleting the supplier. Please try again.', 'error');
                }
            }); 
        });
    });

    // Export suppliers to Excel
    $('#export_excel').on('click', function() {
        var data = supplierTable.rows({ search: 'applied' }).data().toArray();
        var formattedData = data.map(function(supplier) {
            return {
                ID: supplier.id,
                Name: supplier.supplier_name,
                Image: supplier.image
            };
        });
        var ws = XLSX.utils.json_to_sheet(formattedData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
        XLSX.writeFile(wb, "suppliers.xlsx");
    });

    function showNotification(message, type) {
        var alertDiv = type === 'success' ? $('#supplier_success-alert') : $('#supplier_error-alert');
        var messageSpan = type === 'success' ? $('#supplier_success-message') : $('#supplier_error-message');
        messageSpan.text(message);
        alertDiv.fadeIn();

        setTimeout(function() {
            alertDiv.fadeOut();
        }, 4000);
    }

    function showModalNotification(message, type) {
        var alertDiv = type === 'success' ? '<div class="alert alert-success">' : '<div class="alert alert-danger">';
        alertDiv += message + '</div>';
        $('#supplier_modal .modal-body').prepend(alertDiv);

        setTimeout(function() {
            $('#supplier_modal .alert').remove();
        }, 4000);
    }

    function validateForm() {
        let isValid = true;
        $('.text-danger').text('');

        if ($('#supplier_name').val().trim() === '') {
            $('#supplier_name_error').text('Name is required');
            isValid = false;
        }

        var supplierName = $('#supplier_name').val().trim().toLowerCase();
        var exists = suppliers.some(function(supplier) {
            return supplier.supplier_name.toLowerCase() === supplierName;
        });

        if (exists && $('#action_button_supplier').text() !== 'Update') {
            $('#supplier_name_error').text('Supplier with this name already exists.');
            isValid = false;
        }

        if ($('#action_button_supplier').text() === 'Create' && $('#supplier_image').val().trim() === '') {
            $('#supplier_image_error').text('Image is required');
            isValid = false;
        }

        return isValid;
    }

    $('#supplier_image').on('change', function() {
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
