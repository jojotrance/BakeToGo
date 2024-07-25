$(document).ready(function() {
    console.log('Document is ready');

    var productDataTable = $('#product_datatable').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/api/admin/products",
            type: "GET",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: function(d) {
                console.log('Sending search value:', d.search.value);
                return $.extend({}, d, {
                    search: {
                        value: d.search.value
                    }
                });
            },
            dataSrc: function(json) {
                if (!json || !json.data) {
                    console.error("Invalid JSON response:", json);
                    return [];
                }
                return json.data;
            },
            error: function(xhr) {
                console.error("Error in fetching data: ", xhr.responseText);
            }
        },
        columns: [
            { data: 'id', name: 'id', width: '5%' },
            { data: 'name', name: 'name', width: '20%' },
            { data: 'description', name: 'description', width: '30%' },
            { data: 'price', name: 'price', width: '10%' },
            { data: 'category', name: 'category', width: '10%' },
            { data: 'stock', name: 'stock', width: '10%' },
            {
                data: 'image_url',
                name: 'image_url',
                width: '10%',
                render: function(data, type, full, meta) {
                    if (type === 'display') {
                        return '<img src="' + (data ? data : '/storage/product_images/default-placeholder.png') + '" alt="Product Image" class="img-thumbnail" width="30" height="30">';
                    }
                    return data;
                }
            },
            {
                data: null,
                width: '15%',
                render: function(data, type, row) {
                    return `
                        <button type="button" class="btn btn-warning btn-sm edit-btn" data-id="${row.id}">Edit</button>
                        <button type="button" class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>
                    `;
                }
            }
        ],
        lengthMenu: [10, 25, 50, 100],
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'csvHtml5',
                text: 'Export CSV',
                className: 'btn btn-info',
                titleAttr: 'Export to CSV'
            },
            {
                extend: 'excelHtml5',
                text: 'Export Excel',
                className: 'btn btn-success',
                titleAttr: 'Export to Excel'
            }
        ],
        language: {
            search: "Search:",
            lengthMenu: "Show _MENU_ entries"
        }
    });

    $('#product_form').on('submit', function(event) {
        event.preventDefault();
        $(".form-control").removeClass('is-invalid');
        $(".invalid-feedback").remove();

        var formData = new FormData(this);
        var id = $('#hidden_id').val();
        var name = $('#name').val();

        var duplicate = false;
        productDataTable.rows().every(function() {
            var data = this.data();
            if (data.name === name && data.id != id) {
                duplicate = true;
                return false;
            }
        });

        if (duplicate) {
            var errorMessage = $('<span class="invalid-feedback" style="display:block;color:red;">A product with the same name already exists.</span>');
            $('#name').addClass('is-invalid').after(errorMessage);
        } else {
            submitProductForm(formData, id);
        }
    });

    function submitProductForm(formData, id) {
        var actionUrl = id ? `/api/admin/products/${id}` : '/api/admin/products';
        if (id) {
            formData.append('_method', 'PUT');
        }

        $('#loading-indicator').show();

        $.ajax({
            url: actionUrl,
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('Server response:', response);
                $('#product_modal').modal('hide');
                $('#product_form')[0].reset();
                productDataTable.ajax.reload(null, false);
                if (response.success) {
                    showSuccessMessage('Item ' + (id ? 'updated' : 'added') + ' successfully.');
                } else {
                    showErrorMessage(response.message || 'An error occurred. Please try again.');
                }
            },
            error: function(xhr) {
                console.error('AJAX error:', xhr);
                let errorMessage = 'An error occurred. Please try again.';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMessage = xhr.responseJSON.error;
                }
                $('#product_modal').modal('hide');
                showErrorMessage(errorMessage);
                productDataTable.ajax.reload(null, false);
            },
            complete: function() {
                $('#loading-indicator').hide();
            }
        });
    }

    $(document).on('click', '.edit-btn', function() {
        var id = $(this).data('id');
        $.ajax({
            url: `/api/admin/products/${id}`,
            method: 'GET',
            success: function(response) {
                var product = response.data;
                $('#name').val(product.name);
                $('#description').val(product.description);
                $('#price').val(product.price);
                $('#category').val(product.category);
                $('#stock').val(product.stock);
                $('#hidden_id').val(product.id);
                $('#modal_title').text('Edit Product');
                $('#action_button').text('Update');
                $('#product_modal').modal('show');
            },
            error: function(xhr) {
                console.error("Error:", xhr.responseText);
            }
        });
    });

    $(document).on('click', '.delete-btn', function() {
        var id = $(this).data('id');
        $('#confirm_message').text('Are you sure you want to delete this product?');
        $('#confirm_button').data('id', id);
        $('#confirmModal').modal('show');
    });

    $('#confirm_button').on('click', function() {
        var id = $(this).data('id');
        $.ajax({
            url: `/api/admin/products/${id}`,
            method: 'DELETE',
            success: function(response) {
                if (response.success) {
                    $('#confirmModal').modal('hide');
                    showSuccessMessage(response.message);
                    productDataTable.ajax.reload();
                } else {
                    showErrorMessage(response.message);
                }
            },
            error: function(xhr) {
                showErrorMessage('An error occurred. Please try again.');
            }
        });
    });

    $('#product_modal').on('hidden.bs.modal', function() {
        $('#product_form')[0].reset();
        $('#hidden_id').val('');
        $('#modal_title').text('Add New Product');
        $('#action_button').text('Save');
    });

    $('#create_product').on('click', function() {
        $('#product_form')[0].reset();
        $('#hidden_id').val('');
        $('#modal_title').text('Add New Product');
        $('#action_button').text('Save');
        $('#product_modal').modal('show');
    });

    $('#export_excel').on('click', function() {
        var data = productDataTable.rows().data().toArray();
        var ws = XLSX.utils.json_to_sheet(data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        XLSX.writeFile(wb, "products.xlsx");
    });

    $(document).on('productCreated', function() {
        console.log('Product created event received');
    });

    if (localStorage.getItem('productCreated') === 'true') {
        productDataTable.ajax.reload();
        localStorage.removeItem('productCreated');
    }

    function showSuccessMessage(message) {
        $('#success-message').text(message);
        $('#success-alert').removeClass('alert-danger').addClass('alert-success');
        $('#success-alert').appendTo('body').show().delay(10000).fadeOut(); // Show for 10 seconds
    }

    function showErrorMessage(message) {
        $('#error-message').text(message);
        $('#error-alert').removeClass('alert-success').addClass('alert-danger');
        $('#error-alert').appendTo('body').show().delay(10000).fadeOut(); // Show for 10 seconds
    }

    function validateForm() {
        var isValid = true;
        $('.form-control').each(function() {
            if ($(this).val().trim() === '' && $(this).prop('required')) {
                isValid = false;
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        return isValid;
    }

    $('#product_form').on('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            showErrorMessage('Please fill all required fields.');
        }
    });

    $('.form-control').on('input', function() {
        $(this).removeClass('is-invalid');
    });

    $(document).on('stockUpdated', function() {
        productDataTable.ajax.reload();
    });

    if (localStorage.getItem('stockUpdated') === 'true') {
        productDataTable.ajax.reload();
        localStorage.removeItem('stockUpdated');
    }
});
