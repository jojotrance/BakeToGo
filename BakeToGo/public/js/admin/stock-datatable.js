$(document).ready(function() {
    console.log('Document is ready');

    // Function to initialize the stock DataTable
    function initializeStockTable() {
        $('#stock_table').DataTable({
            processing: true,
            serverSide: true,
            retrieve: true,
            ajax: {
                url: "/api/stocks",
                type: 'GET',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                dataSrc: function(json) {
                    console.log("Received data:", json);
                    if (!json.data) {
                        console.error("Invalid JSON response:", json);
                        return [];
                    }
                    return json.data;
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', status, error);
                    console.error('Response Text:', xhr.responseText);
                    alert('Failed to load stocks. Please try again.');
                }
            },
            columns: [
                { 
                    data: 'product_name',  // Use product_name instead of product_id
                    name: 'product_name',
                    render: function(data, type, row) {
                        return data || 'N/A';
                    }
                },
                { 
                    data: 'quantity', 
                    name: 'quantity',
                    render: function(data, type, row) {
                        return data || '0';
                    }
                },
                { 
                    data: 'supplier_name', 
                    name: 'supplier_name',
                    render: function(data, type, row) {
                        return data || 'N/A';
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
                searchPlaceholder: "Search stock",
                search: ""
            },
        });
    }

    // Initialize the stock DataTable on document ready
    initializeStockTable();

    // Create Stock Button Click
    $('#create_stock').on('click', function() {
        $('#stock_form')[0].reset();
        $('#modal_title').text('Add New Stock');
        $('#action_button').text('Create');
        $('.text-danger').text('');
        loadProducts();
        loadSuppliers();
        $('#stock_modal').modal('show');
    });

    // Form Submission
    $('#stock_form').on('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            let formData = new FormData(this);
            let url = "/api/stocks";
            let type = 'POST';
            if ($('#hidden_id').val()) {
                url = "/api/stocks/" + $('#hidden_id').val();
                formData.append('_method', 'PUT');
            }

            $.ajax({
                url: url,
                type: type,
                data: formData,
                contentType: false,
                processData: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    console.log('Stock saved:', response);
                    $('#stock_modal').modal('hide');
                    alert('Stock has been successfully ' + ($('#hidden_id').val() ? 'updated!' : 'added!'));
                    $('#stock_table').DataTable().ajax.reload();  // Reload the table data
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', status, error);
                    console.error('Response Text:', xhr.responseText);
                    alert('An error occurred. Please try again.');
                }
            });
        }
    });

    // Edit Button Click
    $(document).on('click', '.edit', function() {
        var id = $(this).data('id');
        console.log('Editing stock with ID:', id);
        $.ajax({
            url: "/api/stocks/" + id,
            type: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(stock) {
                console.log('Received stock data:', stock);
                $('#quantity').val(stock.quantity || 0);
                $('#supplier_id').val(stock.supplier_id || '');
                $('#product_id').val(stock.product_id || '');
                $('#hidden_id').val(stock.id || '');
                $('#modal_title').text('Edit Stock');
                $('#action_button').text('Update');
                $('.text-danger').text('');
                loadSuppliers();
                loadProducts();
                $('#stock_modal').modal('show');
            },
            error: function(xhr, status, error) {
                if (xhr.status === 419) {
                    console.error('CSRF token mismatch:', xhr.responseText);
                }
                console.error('AJAX Error:', error);
                console.log('Response:', xhr.responseText);
                showModalNotification('Failed to load stock details.', 'error');
            }
        });
    });

    // Delete Button Click
    $(document).on('click', '.delete', function() {
        var id = $(this).data('id');
        console.log('Delete button clicked for stock ID:', id);
        $('#confirm_message').text('Are you sure you want to delete this stock entry?');
        $('#confirm_button').text('Delete');
        $('#confirmModal').modal('show');
    
        $('#confirm_button').off('click').on('click', function() {
            console.log('Deleting stock with ID:', id);
            $.ajax({
                url: "/api/stocks/" + id,
                type: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    console.log('Delete response:', response);
                    $('#confirmModal').modal('hide');
                    alert('Stock has been successfully deleted!');
                    $('#stock_table').DataTable().ajax.reload();  // Reload the table data
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', status, error);
                    console.error('Response Text:', xhr.responseText);
                    alert('Failed to delete stock.');
                }
            });
        });
    });

    // Export to Excel
    $('#export_excel').on('click', function() {
        console.log('Export to Excel button clicked');
        var data = $('#stock_table').DataTable().rows({ search: 'applied' }).data().toArray();
        var formattedData = data.map(function(stock) {
            return {
                Product: stock.product_name || 'N/A',
                Quantity: stock.quantity || '0',
                Supplier: stock.supplier_name || 'N/A'
            };
        });
        var ws = XLSX.utils.json_to_sheet(formattedData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Stocks");
        XLSX.writeFile(wb, "stocks.xlsx");
    });

    // Load Suppliers
    function loadSuppliers() {
        $.ajax({
            url: "/api/admin/suppliers",
            type: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.data) {
                    $('#supplier_id').empty().append('<option value="">Select Supplier</option>');
                    $.each(response.data, function(index, supplier) {
                        $('#supplier_id').append('<option value="' + supplier.id + '">' + supplier.supplier_name + '</option>');
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                console.error('Response Text:', xhr.responseText);
                alert('Failed to load suppliers. Please try again.');
            }
        });
    }

    // Load Products
    function loadProducts() {
        $.ajax({
            url: "/api/admin/products",
            type: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                if (response.data) {
                    $('#product_id').empty().append('<option value="">Select Product</option>');
                    $.each(response.data, function(index, product) {
                        $('#product_id').append('<option value="' + product.id + '">' + product.name + '</option>');
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                console.error('Response Text:', xhr.responseText);
                alert('Failed to load products. Please try again.');
            }
        });
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        $('.text-danger').text('');

        if ($('#quantity').val() === '') {
            $('#quantity_error').text('Quantity is required');
            isValid = false;
        }

        if ($('#product_id').val() === '') {
            $('#product_id_error').text('Product is required');
            isValid = false;
        }

        if ($('#supplier_id').val() === '') {
            $('#supplier_id_error').text('Supplier is required');
            isValid = false;
        }

        return isValid;
    }

    // Listen for product creation event
    $(document).on('productCreated', function() {
        console.log('Product created event received');
        $('#stock_table').DataTable().ajax.reload();
    });

    // Check for newly created product using localStorage
    if (localStorage.getItem('productCreated') === 'true') {
        console.log('New product detected, reloading stock table');
        $('#stock_table').DataTable().ajax.reload();
        localStorage.removeItem('productCreated');
    }
});
