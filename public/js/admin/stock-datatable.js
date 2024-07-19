$(document).ready(function() {
    console.log('Document is ready');

    var stockTable = $('#stock_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/api/admin/stocks/fetchStocks",
            type: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: function(d) {
                d.search = $('input[type="search"]').val();
            },
            dataSrc: function(json) {
                console.log('Stock data:', json.data);
                return json.data;
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                console.error('Response Text:', xhr.responseText);
                if (xhr.responseText) {
                    try {
                        var jsonResponse = JSON.parse(xhr.responseText);
                        console.error('Parsed JSON Error:', jsonResponse);
                    } catch (e) {
                        console.error('Failed to parse JSON:', e);
                    }
                }
                showNotification('Failed to load stocks. Please try again.', 'error');
            }
        },
        columns: [
            { data: 'id', name: 'id' },
            { data: 'quantity', name: 'quantity' },
            { data: 'supplier_name', name: 'supplier_name' }, // Display supplier name
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

    function showNotification(message, type) {
        var alertDiv = type === 'success' ? $('#success-alert') : $('#error-alert');
        var messageSpan = type === 'success' ? $('#success-message') : $('#error-message');
        
        messageSpan.text(message);
        alertDiv.fadeIn();

        setTimeout(function() {
            alertDiv.fadeOut();
        }, 4000);
    }

    function validateForm() {
        let isValid = true;
        $('.text-danger').text('');  // Clear previous error messages

        if ($('#quantity').val().trim() === '' || parseInt($('#quantity').val().trim()) <= 0) {
            $('#quantity_error').text('Valid quantity is required and must be greater than zero');
            isValid = false;
        }
        if ($('#supplier_id').val().trim() === '') {
            $('#supplier_id_error').text('Supplier is required');
            isValid = false;
        }

        return isValid;
    }

    $('#create_stock').on('click', function() {
        console.log('Create Stock button clicked');
        $('#stock_form')[0].reset();
        $('#modal_title').text('Add New Stock');
        $('#action_button').text('Create');
        $('.text-danger').text('');
        loadSuppliers();
        $('#stock_modal').modal('show');
    });

    $('#stock_form').on('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            let formData = new FormData(this);
            let url = "/api/admin/stocks/storeStocks";
            let type = 'POST';
            if ($('#action_button').text() === 'Update') {
                url = "/api/admin/stocks/updateStock/" + $('#hidden_id').val();
                type = 'POST';
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
                    showNotification('Stock has been successfully ' + ($('#action_button').text() === 'Create' ? 'added!' : 'updated!'), 'success');
                    stockTable.ajax.reload();
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', status, error);
                    console.error('Response Text:', xhr.responseText);
                    showNotification('An error occurred. Please try again.', 'error');
                }
            });
        }
    });

    $(document).on('click', '.edit', function() {
        var id = $(this).data('id');
        console.log('Editing stock with ID:', id);
        $.ajax({
            url: "/api/admin/stocks/showStock/" + id,
            type: 'GET',
            dataType: 'json',
            success: function(stock) {
                console.log('Received stock data:', stock);
                $('#quantity').val(stock.quantity);
                $('#supplier_id').val(stock.supplier_id); // Populate supplier field
                $('#hidden_id').val(stock.id);
                $('#modal_title').text('Edit Stock');
                $('#action_button').text('Update');
                $('.text-danger').text('');
                $('#stock_modal').modal('show');
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                console.error('Response Text:', xhr.responseText);
                showNotification('Failed to load stock details.', 'error');
            }
        });
    });

    $(document).on('click', '.delete', function() {
        var id = $(this).data('id');
        console.log('Delete button clicked for stock ID:', id);
        $('#confirm_message').text('Are you sure you want to delete this stock entry?');
        $('#confirm_button').text('Delete');
        $('#confirmModal').modal('show');

        $('#confirm_button').off('click').on('click', function() {
            console.log('Deleting stock with ID:', id);
            $.ajax({
                url: "/api/admin/stocks/deleteStock/" + id,
                type: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    console.log('Delete response:', response);
                    $('#confirmModal').modal('hide');
                    showNotification('Stock has been successfully deleted!', 'success');
                    stockTable.ajax.reload();
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', status, error);
                    console.error('Response Text:', xhr.responseText);
                    showNotification('Failed to delete stock.', 'error');
                }
            });
        });
    });

    $('#export_excel').on('click', function() {
        console.log('Export to Excel button clicked');
        var data = stockTable.rows({ search: 'applied' }).data().toArray(); // Get all the data from the table
        var formattedData = data.map(function(stock) {
            return {
                ID: stock.id,
                Quantity: stock.quantity,
                Supplier: stock.supplier_name // Include supplier name in the export
            };
        });
        var ws = XLSX.utils.json_to_sheet(formattedData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Stocks");
        XLSX.writeFile(wb, "stocks.xlsx");
    });

    function loadSuppliers() {
        $.ajax({
            url: "/api/admin/suppliers/fetchSuppliers",
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
                showNotification('Failed to load suppliers. Please try again.', 'error');
            }
        });
    }
});
