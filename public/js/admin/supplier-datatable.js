$(function() {
    console.log('Document is ready');

    var supplierTable = $('#supplier_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/api/admin/suppliers/fetchSuppliers",
            type: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataSrc: function(json) {
                console.log('Supplier data:', json.data);
                return json.data;
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                console.error('Response Text:', xhr.responseText);
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
                    return '<button type="button" class="edit btn btn-primary btn-sm" data-id="' + full.id + '">Edit</button> ' +
                           '<button type="button" class="delete btn btn-danger btn-sm" data-id="' + full.id + '">Delete</button>';
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

    var stockTable = $('#stock_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/api/admin/stocks/fetchStocks",
            type: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataSrc: function(json) {
                console.log('Stock data:', json.data);
                return json.data;
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                console.error('Response Text:', xhr.responseText);
                showNotification('Failed to load stocks. Please try again.', 'error');
            }
        },
        columns: [
            { data: 'id', name: 'id' },
            { data: 'quantity', name: 'quantity' },
            { data: 'supplier.supplier_name', name: 'supplier.supplier_name' },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, full, meta) {
                    return '<button type="button" class="edit btn btn-primary btn-sm" data-id="' + full.id + '">Edit</button> ' +
                           '<button type="button" class="delete btn btn-danger btn-sm" data-id="' + full.id + '">Delete</button>';
                }
            }
        ],
        responsive: true,
        lengthMenu: [10, 25, 50, 75, 100],
        pageLength: 10,
        language: {
            searchPlaceholder: "Search stocks",
            search: ""
        }
    });

    // Create Supplier button click event
    $(document).on('click', '#create_supplier', function() {
        console.log('Create Supplier button clicked');
        $('#supplier_form')[0].reset();
        $('#modal_title_supplier').text('Add New Supplier');
        $('#action_button_supplier').text('Create');
        $('#image').attr('required', true);
        $('.text-danger').text('');
        $('#supplier_modal').modal('show');
    });

    // Handle Add/Edit modal actions
    $('#supplier_form').on('submit', function(event) {
        event.preventDefault();
        if (!validateForm()) return;

        var action_url = $('#action_button_supplier').text() === 'Update' ? 
                        "/api/admin/suppliers/suppliers/" + $('#hidden_id_supplier').val() : 
                        "/api/admin/suppliers/storeSuppliers";
        var method = $('#action_button_supplier').text() === 'Update' ? 'PUT' : 'POST';
        var formData = new FormData(this);

        // Check for existing supplier before submitting
        $.ajax({
            url: "/api/admin/suppliers/checkSupplierExistence",
            method: 'POST',
            data: { supplier_name: $('#supplier_name').val().trim() },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.exists && $('#action_button_supplier').text() !== 'Update') {
                    showModalNotification('Supplier with this name already exists. Please choose a different name.', 'error');
                    return; // Prevent submission
                } else {
                    submitForm(action_url, method, formData);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                console.log('Response:', xhr.responseText);
                showModalNotification('An error occurred while checking for existing suppliers. Please try again.', 'error');
            }
        });
    });

    function submitForm(action_url, method, formData) {
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
                console.log('Submit response:', data);
                if (data.success) {
                    $('#supplier_modal').modal('hide');
                    supplierTable.ajax.reload(null, false);
                    showNotification(data.message, 'success');
                    $('#supplier_form')[0].reset();

                    // Update stock table with new supplier and default stock
                    stockTable.ajax.reload(null, false);
                } else {
                    showModalNotification(data.message || 'An error occurred', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                console.log('Response:', xhr.responseText);
                showModalNotification('An error occurred. Please try again.', 'error');
            }
        });
    }

    // Handle Edit action
    $(document).on('click', '.edit', function() {
        var id = $(this).data('id');
        console.log('Edit button clicked for supplier ID:', id);

        $('#supplier_form').find('.text-danger').html('');

        $.ajax({
            url: "/api/admin/suppliers/" + id,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log('Edit Data:', response);
                if (response.success && response.data) {
                    var supplier = response.data;
                    $('#supplier_name').val(supplier.supplier_name || '');
                    $('#hidden_id_supplier').val(supplier.id || '');
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
                console.error('AJAX Error:', error);
                console.log('Response:', xhr.responseText);
                showModalNotification('Failed to load supplier details.', 'error');
            }
        });
    });

    // Handle Delete action
    $(document).on('click', '.delete', function() {
        var id = $(this).data('id');
        console.log('Delete button clicked for supplier ID:', id);

        $('#confirm_message').text('Are you sure you want to delete this supplier?');
        $('#confirm_button').text('Delete');
        $('#confirmModal').modal('show');

        $('#confirm_button').off('click').on('click', function() {
            $('#confirmModal').modal('hide');
            $.ajax({
                url: "/api/admin/suppliers/" + id,
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(data) {
                    console.log('Delete response:', data);
                    supplierTable.ajax.reload(null, false);
                    showNotification('Supplier has been successfully deleted!', 'success');
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', error);
                    console.log('Response:', xhr.responseText);
                    showNotification('An error occurred while deleting the supplier. Please try again.', 'error');
                }
            });
        });
    });

    // Handle Export to Excel action
    $('#export_excel').on('click', function() {
        console.log('Export to Excel button clicked');
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
        if ($('#action_button_supplier').text() === 'Create' && $('#image').val().trim() === '') {
            $('#image_error').text('Image is required');
            isValid = false;
        }

        return isValid;
    }

    // Real-time supplier name detection
    $('#supplier_name').on('input', function() {
        var supplierName = $(this).val().trim();
        if (supplierName === '') {
            $('#supplier_name_error').text('');
            return;
        }

        $.ajax({
            url: "/api/admin/suppliers/checkSupplierExistence",
            method: 'POST',
            data: { supplier_name: supplierName },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.exists && $('#action_button_supplier').text() !== 'Update') {
                    $('#supplier_name_error').text('Supplier with this name already exists.');
                } else {
                    $('#supplier_name_error').text('');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                console.log('Response:', xhr.responseText);
                $('#supplier_name_error').text('An error occurred while checking for existing suppliers.');
            }
        });
    });

    // Image preview
    $('#image').on('change', function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#image_preview').attr('src', e.target.result).show();
            }
            reader.readAsDataURL(file);
        } else {
            $('#image_preview').hide();
        }
    });
});