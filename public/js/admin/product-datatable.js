$(document).ready(function() {
    console.log('DataTable Initialization');

    var productDataTable;

    // Initialize DataTable if not already initialized
    if (!$.fn.DataTable.isDataTable('#product_datatable')) {
        productDataTable = $('#product_datatable').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/admin/products/fetchProducts",
                type: "GET",
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                dataSrc: function(json) {
                    console.log('JSON Response:', json);
                    if (!json || !json.data) {
                        console.error("Invalid JSON response:", json);
                        return [];
                    }
                    return json.data;
                },
                error: function(xhr, error, thrown) {
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
                    data: 'image',
                    name: 'image',
                    width: '10%',
                    render: function(data, type, full, meta) {
                        if (type === 'display') {
                            return '<img src="' + (data ? data : '/images/default-placeholder.png') + '" alt="Product Image" class="img-thumbnail" width="30" height="30">';
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
    }

    // Handle form submissions
    $('#product_form').on('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(this);
        var actionUrl = $('#hidden_id').val() ? `/api/admin/products/update/${$('#hidden_id').val()}` : '/api/admin/products/create';
        var method = $('#hidden_id').val() ? 'POST' : 'POST';

        $.ajax({
            url: actionUrl,
            method: method,
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('Response:', response);
                if (response.success) {
                    $('#product_modal').modal('hide');
                    $('#success-message').text(response.message);
                    $('#success-alert').show();
                    productDataTable.ajax.reload();
                } else {
                    $('#error-message').text(response.message);
                    $('#error-alert').show();
                }
            },
            error: function(xhr) {
                console.error("Error:", xhr.responseText);
                $('#error-message').text('An error occurred. Please try again.');
                $('#error-alert').show();
            }
        });
    });

    // Handle edit button click
    $(document).on('click', '.edit-btn', function() {
        var id = $(this).data('id');
        $.ajax({
            url: `/api/admin/products/${id}`,
            method: 'GET',
            success: function(response) {
                if (response.success) {
                    var product = response.data;
                    $('#name').val(product.name);
                    $('#description').val(product.description);
                    $('#price').val(product.price);
                    $('#category').val(product.category);
                    $('#stock').val(product.stock);
                    $('#hidden_id').val(product.id);
                    $('#modal_title').text('Edit Product');
                    $('#product_modal').modal('show');
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

    // Confirm delete action
    $('#confirm_button').on('click', function() {
        var id = $(this).data('id');
        $.ajax({
            url: `/api/admin/products/delete/${id}`,
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
                console.error("Error:", xhr.responseText);
                $('#error-message').text('An error occurred. Please try again.');
                $('#error-alert').show();
            }
        });
    });

    // Clear alerts on modal hide
    $('#product_form').on('hidden.bs.modal', function() {
        $('#success-alert').hide();
        $('#error-alert').hide();
        $('#product_form')[0].reset();
        $('#hidden_id').val('');
        $('#modal_title').text('Add New Product');
    });

    // Handle create product button click
    $('#create_product').on('click', function() {
        $('#product_form')[0].reset();
        $('#hidden_id').val('');
        $('#modal_title').text('Add New Product');
        $('#product_modal').modal('show');
    });
});
