$(document).ready(function() {
    console.log('Document is ready');

    // Initialize DataTable for products
    var productDataTable = $('#product_datatable').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/api/products",
            type: "GET",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
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
        ]
    });

    // Handle form submission for creating or updating a product
    $('#product_form').on('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(this);
        var actionUrl = $('#hidden_id').val() ? `/api/products/${$('#hidden_id').val()}` : '/api/products';
        var method = $('#hidden_id').val() ? 'POST' : 'POST';

        $.ajax({
            url: actionUrl,
            method: method,
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    $('#product_modal').modal('hide');
                    $('#success-message').text(response.message);
                    $('#success-alert').show();
                    productDataTable.ajax.reload();

                    // Trigger the productCreated event
                    $(document).trigger('productCreated');
                    // Set localStorage item
                    localStorage.setItem('productCreated', 'true');

                    // If this is a new product (not an update), clear the form
                    if (!$('#hidden_id').val()) {
                        $('#product_form')[0].reset();
                    }
                } else {
                    $('#error-message').text(response.message);
                    $('#error-alert').show();
                }
            },
            error: function(xhr) {
                $('#error-message').text('An error occurred. Please try again.');
                $('#error-alert').show();
            }
        });
    });

    // Handle edit button click
    $(document).on('click', '.edit-btn', function() {
        var id = $(this).data('id');
        console.log("Edit button clicked for ID:", id);
        $.ajax({
            url: `/api/products/${id}`,
            method: 'GET',
            success: function(response) {
                console.log("AJAX response:", response);
                if (response.success) {
                    var product = response.data;
                    $('#name').val(product.name);
                    $('#description').val(product.description);
                    $('#price').val(product.price);
                    $('#category').val(product.category);
                    $('#stock').val(product.stock);
                    $('#image').val(''); // Clear the file input
                    $('#hidden_id').val(product.id);
                    $('#modal_title').text('Edit Product');
                    $('#action_button').text('Update');
                    $('#product_modal').modal('show');
                    console.log("Modal should be shown now");
                } else {
                    console.error('Failed to fetch product data.');
                }
            },
            error: function(xhr) {
                console.error("Error:", xhr.responseText);
            }
        });
    });

    // Handle delete button click
    $(document).on('click', '.delete-btn', function() {
        var id = $(this).data('id');
        $('#confirm_message').text('Are you sure you want to delete this product?');
        $('#confirm_button').data('id', id);
        $('#confirmModal').modal('show');
    });

    // Handle confirm delete button click
    $('#confirm_button').on('click', function() {
        var id = $(this).data('id');
        $.ajax({
            url: `/api/products/${id}`,
            method: 'DELETE',
            success: function(response) {
                if (response.success) {
                    $('#confirmModal').modal('hide');
                    $('#success-message').text(response.message);
                    $('#success-alert').show();
                    productDataTable.ajax.reload();
                } else {
                    $('#error-message').text(response.message);
                    $('#error-alert').show();
                }
            },
            error: function(xhr) {
                $('#error-message').text('An error occurred. Please try again.');
                $('#error-alert').show();
            }
        });
    });

    // Reset modal on close
    $('#product_modal').on('hidden.bs.modal', function() {
        $('#success-alert').hide();
        $('#error-alert').hide();
        $('#product_form')[0].reset();
        $('#hidden_id').val('');
        $('#modal_title').text('Add New Product');
        $('#action_button').text('Create');
    });

    // Handle create product button click
    $('#create_product').on('click', function() {
        $('#product_form')[0].reset();
        $('#hidden_id').val('');
        $('#modal_title').text('Add New Product');
        $('#action_button').text('Create');
        $('#product_modal').modal('show');
    });

    // Handle export to Excel button click
    $('#export_excel').on('click', function() {
        console.log("Export to Excel clicked");
        // Implement Excel export functionality here
        var data = productDataTable.rows().data().toArray();
        var ws = XLSX.utils.json_to_sheet(data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        XLSX.writeFile(wb, "products.xlsx");
    });

    // Listen for product creation event (for other parts of your application)
    $(document).on('productCreated', function() {
        console.log('Product created event received');
        // You can add any additional logic here that should run when a product is created
        // For example, updating other parts of the UI
    });

    // Check for newly created product using localStorage (on page load)
    if (localStorage.getItem('productCreated') === 'true') {
        console.log('New product detected, reloading product table');
        productDataTable.ajax.reload();
        localStorage.removeItem('productCreated');
    }

    // Function to show success message
    function showSuccessMessage(message) {
        $('#success-message').text(message);
        $('#success-alert').show().delay(3000).fadeOut();
    }

    // Function to show error message
    function showErrorMessage(message) {
        $('#error-message').text(message);
        $('#error-alert').show().delay(3000).fadeOut();
    }

    // Function to validate form
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

    // Add form validation before submission
    $('#product_form').on('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            showErrorMessage('Please fill all required fields.');
        }
    });

    // Clear validation on input
    $('.form-control').on('input', function() {
        $(this).removeClass('is-invalid');
    });
});
