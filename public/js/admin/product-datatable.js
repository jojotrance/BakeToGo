$(document).ready(function() {
    console.log('Document is ready');

    var productTable = $('#product_table').DataTable({
        data: [
            {id: 1, name: 'Product A', description: 'Description for Product A', price: 10.99, category: 'Bread', stock: 100, image: 'image1.jpg'},
            {id: 2, name: 'Product B', description: 'Description for Product B', price: 5.99, category: 'Pastries', stock: 50, image: 'image2.jpg'},
            {id: 3, name: 'Product C', description: 'Description for Product C', price: 7.99, category: 'Cookies', stock: 75, image: 'image3.jpg'},
            {id: 4, name: 'Product D', description: 'Description for Product D', price: 15.99, category: 'Cakes', stock: 30, image: 'image4.jpg'},
            {id: 5, name: 'Product E', description: 'Description for Product E', price: 3.99, category: 'Muffins', stock: 150, image: 'image5.jpg'}
        ],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'name', name: 'name' },
            { data: 'description', name: 'description' },
            { data: 'price', name: 'price' },
            { data: 'category', name: 'category' },
            { data: 'stock', name: 'stock' },
            { 
                data: 'image', 
                name: 'image', 
                render: function(data) {
                    return '<img src="/storage/' + data + '" class="img-thumbnail" width="50" />';
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
            searchPlaceholder: "Search products",
            search: ""
        },
    });

    function validateForm() {
        let isValid = true;
        $('.text-danger').text('');  // Clear previous error messages

        if ($('#name').val().trim() === '') {
            $('#name_error').text('Name is required');
            isValid = false;
        }
        if ($('#description').val().trim() === '') {
            $('#description_error').text('Description is required');
            isValid = false;
        }
        if ($('#price').val().trim() === '' || isNaN($('#price').val().trim()) || $('#price').val().trim() <= 0) {
            $('#price_error').text('Valid price is required and must be greater than zero');
            isValid = false;
        }
        if ($('#category').val().trim() === '') {
            $('#category_error').text('Category is required');
            isValid = false;
        }
        if ($('#stock').val().trim() === '' || isNaN($('#stock').val().trim()) || $('#stock').val().trim() < 0) {
            $('#stock_error').text('Valid stock quantity is required and cannot be negative');
            isValid = false;
        }
        if ($('#action_button').text() === 'Create' && $('#image').val().trim() === '') {
            $('#image_error').text('Image is required');
            isValid = false;
        }

        return isValid;
    }

    $('#create_product').on('click', function() {
        console.log('Create Product button clicked');
        $('#product_form')[0].reset();
        $('#modal_title').text('Add New Product');
        $('#action_button').text('Create');
        $('#image').attr('required', true);
        $('.text-danger').text('');
        $('#product_modal').modal('show');
    });

    $('#product_form').on('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            $('#confirm_message').text('Are you sure you want to ' + ($('#action_button').text() === 'Create' ? 'add this product?' : 'update this product?'));
            $('#confirm_button').text($('#action_button').text() === 'Create' ? 'Add' : 'Update');
            $('#confirmModal').modal('show');
        }
    });

    $('#confirm_button').on('click', function() {
        $('#confirmModal').modal('hide');
        $('#product_modal').modal('hide');
        showNotification('Product has been successfully ' + ($('#action_button').text() === 'Create' ? 'added!' : 'updated!'), 'success');
    });

    $(document).on('click', '.edit', function() {
        var id = $(this).data('id');
        alert('Edit clicked for ID: ' + id);
        $('#name').val('Product A');  // Example value
        $('#description').val('Description for Product A');  // Example value
        $('#price').val(10.99);  // Example value
        $('#category').val('Bread');  // Example value
        $('#stock').val(100);  // Example value
        $('#hidden_id').val(id);
        $('#modal_title').text('Edit Product');
        $('#action_button').text('Update');
        $('#image').attr('required', false);
        $('.text-danger').text('');
        $('#product_modal').modal('show');
    });

    $(document).on('click', '.delete', function() {
        var id = $(this).data('id');
        $('#confirm_message').text('Are you sure you want to delete this product?');
        $('#confirm_button').text('Delete');
        $('#confirmModal').modal('show');

        $('#confirm_button').off('click').on('click', function() {
            $('#confirmModal').modal('hide');
            showNotification('Product has been successfully deleted!', 'success');
        });
    });

    $('#export_excel').on('click', function() {
        console.log('Export to Excel button clicked');
        var data = productTable.rows({ search: 'applied' }).data().toArray(); // Get all the data from the table
        var formattedData = data.map(function(product) {
            return {
                ID: product.id,
                Name: product.name,
                Description: product.description,
                Price: product.price,
                Category: product.category,
                Stock: product.stock,
                Image: product.image
            };
        });
        var ws = XLSX.utils.json_to_sheet(formattedData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        XLSX.writeFile(wb, "products.xlsx");
    });

    function showNotification(message, type) {
        var alertDiv = type === 'success' ? $('#success-alert') : $('#error-alert');
        var messageSpan = type === 'success' ? $('#success-message') : $('#error-message');
        
        messageSpan.html(message);
        alertDiv.fadeIn();

        setTimeout(function() {
            alertDiv.fadeOut();
        }, 4000);
    }
});