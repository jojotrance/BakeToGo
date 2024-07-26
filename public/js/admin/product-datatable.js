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
                showNotification('Failed to load products. Please try again.', 'error');
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
                data: 'image',
                name: 'image',
                width: '10%',
                render: function(data, type, full, meta) {
                    if (type === 'display') {
                        var imageUrl = data ? `/storage/product_images/${data}` : '/storage/product_images/default-placeholder.png';
                        return '<img src="' + imageUrl + '" alt="Product Image" class="img-thumbnail" width="30" height="30">';
                    }
                    return data;
                }
            },
            {
                data: null,
                width: '15%',
                render: function(data, type, row) {
                    return `
                        <button type="button" class="btn btn-warning btn-sm product-edit-btn" data-id="${row.id}">Edit</button>
                        <button type="button" class="btn btn-danger btn-sm product-delete-btn" data-id="${row.id}">Delete</button>
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

    // Event listener for the create product button
    $('#create_product').on('click', function() {
        $('#product_modal').modal('show');
        $('#product_form')[0].reset();
        $('#modal_title').text('Add New Product');
        $('#action_button').text('Save');
        $('#hidden_id').val('');
        clearErrors();
    });

    // Submit handler for the product form
    $('#product_form').on('submit', function(event) {
        event.preventDefault();
        var actionUrl = $('#hidden_id').val() ? `/api/admin/products/${$('#hidden_id').val()}` : "/api/admin/products";
        var method = $('#hidden_id').val() ? 'POST' : 'POST';  // Always POST, but include _method for PUT

        console.log("Submitting form to URL:", actionUrl, "with method:", method);
        var formData = new FormData(this);
        if ($('#hidden_id').val()) {
            formData.append('_method', 'PUT');
        }

        formData.forEach((value, key) => {
            console.log(key + ": " + value);
        });

        $.ajax({
            url: actionUrl,
            method: 'POST',  // Always POST, but include _method for PUT
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function() {
                $('#action_button').attr('disabled', 'disabled');
                $('#action_button').text('Processing...');
            },
            success: function(data) {
                console.log("Form submission successful:", data);
                $('#action_button').attr('disabled', false);
                $('#action_button').text('Save');
                $('#product_modal').modal('hide');
                productDataTable.ajax.reload();
                showNotification($('#hidden_id').val() ? 'Product updated successfully.' : 'Product created successfully.', 'success');
            },
            error: function(xhr) {
                console.error("Form submission failed:", xhr.responseText);
                $('#action_button').attr('disabled', false);
                $('#action_button').text('Save');
                var errors = xhr.responseJSON.errors;
                displayErrors(errors);
                showNotification('Failed to save product. Please check the form for errors.', 'error');
            }
        });
    });

    // Event listener for the edit product button
    $('#product_datatable').on('click', '.product-edit-btn', function() {
        var productId = $(this).data('id');
        $.ajax({
            url: `/api/admin/products/${productId}`,
            method: 'GET',
            success: function(response) {
                console.log("Product data fetched for edit:", response);
                var data = response.data;
                $('#product_modal').modal('show');
                $('#modal_title').text('Edit Product');
                $('#action_button').text('Update');
                $('#name').val(data.name);
                $('#description').val(data.description);
                $('#price').val(data.price);
                $('#category').val(data.category);
                $('#stock').val(data.stock);
                $('#hidden_id').val(data.id);
                clearErrors();
            },
            error: function(xhr) {
                showNotification('Failed to fetch product details. Please try again.', 'error');
            }
        });
    });

    // Event listener for the delete product button
    $('#product_datatable').on('click', '.product-delete-btn', function() {
        var productId = $(this).data('id');
        $('#confirmModal').modal('show');
        $('#confirm_message').text('Are you sure you want to delete this product?');
        $('#confirm_button').off('click').on('click', function() {
            $.ajax({
                url: `/api/admin/products/${productId}`,
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(data) {
                    $('#confirmModal').modal('hide');
                    productDataTable.ajax.reload();
                    showNotification(data.message, 'success');
                },
                error: function(xhr) {
                    showNotification('Failed to delete product. Please try again.', 'error');
                }
            });
        });
    });

    function clearErrors() {
        $('#name_error').text('');
        $('#description_error').text('');
        $('#price_error').text('');
        $('#category_error').text('');
        $('#stock_error').text('');
        $('#image_error').text('');
    }

    function displayErrors(errors) {
        if (errors.name) {
            $('#name_error').text(errors.name[0]);
        }
        if (errors.description) {
            $('#description_error').text(errors.description[0]);
        }
        if (errors.price) {
            $('#price_error').text(errors.price[0]);
        }
        if (errors.category) {
            $('#category_error').text(errors.category[0]);
        }
        if (errors.stock) {
            $('#stock_error').text(errors.stock[0]);
        }
        if (errors.image) {
            $('#image_error').text(errors.image[0]);
        }
    }

    function showNotification(message, type) {
        var alert = type === 'error' ? '#error-alert' : '#success-alert';
        $(alert).show();
        if (type === 'error') {
            $('#error-message').text(message);
        } else {
            $('#success-message').text(message);
        }
        setTimeout(function() {
            $(alert).hide();
        }, 5000);
    }
});