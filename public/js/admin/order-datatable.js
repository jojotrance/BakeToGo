$(document).ready(function() {
    console.log('Document is ready');
    
    var orderTable = $('#order_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/api/admin/orders",
            type: 'GET',
            error: function(xhr, error, thrown) {
                console.error('DataTables error: ', error);
                console.error('Details: ', thrown);
                console.error('Response: ', xhr.responseText);
                alert('An error occurred while fetching data. Please check the console for more details.');
            }
        },
        columns: [
            { data: 'id', name: 'id' },
            { data: 'customer', name: 'customer' },
            { data: 'status', name: 'status' },
            { data: 'payment_method', name: 'payment_method' },
            { data: 'courier', name: 'courier' },
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
            searchPlaceholder: "Search orders",
            search: ""
        }
    });

    function validateForm() {
        let isValid = true;
        $('.text-danger').text('');  // Clear previous error messages

        if ($('#status').val().trim() === '') {
            $('#status_error').text('Status is required');
            isValid = false;
        }

        return isValid;
    }

    $('#order_form').on('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            $('#confirm_message').text('Are you sure you want to update this order?');
            $('#confirm_button').text('Update');
            $('#confirm_button').off('click').on('click', handleUpdate); // Ensure the correct event handler is bound
            $('#confirmModal').modal('show');
        }
    });

    function handleUpdate() {
        var formData = {
            status: $('#status').val()
        };

        var url = "/api/admin/orders/" + $('#hidden_id').val() + "/status";
        var method = "PUT";

        $.ajax({
            url: url,
            method: method,
            data: formData,
            success: function(data) {
                $('#confirmModal').modal('hide');
                $('#order_modal').modal('hide');
                orderTable.ajax.reload();
                showNotification('Order has been successfully updated!', 'success');
            },
            error: function(xhr) {
                $('#confirmModal').modal('hide');
                $('#order_modal').modal('hide');
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    showNotification('An error occurred: ' + xhr.responseJSON.error, 'error');
                } else {
                    showNotification('An error occurred.', 'error');
                }
            }
        });
    }

    $(document).on('click', '.edit', function() {
        var id = $(this).data('id');
        $.ajax({
            url: "/api/admin/orders/" + id,
            dataType: "json",
            success: function(data) {
                $('#customer_id').val(data.customer.fname + ' ' + data.customer.lname).prop('readonly', true);
                $('#status').val(data.status);
                $('#payment_method').val(data.payment_method.payment_name).prop('readonly', true);
                $('#courier').val(data.courier.courier_name).prop('readonly', true);
                $('#hidden_id').val(data.id);
                $('#modal_title').text('Edit Order');
                $('#action_button').text('Update');
                $('.text-danger').text('');
                $('#order_modal').modal('show');
            },
            error: function(xhr) {
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    showNotification('Error fetching order details: ' + xhr.responseJSON.error, 'error');
                } else {
                    showNotification('Error fetching order details.', 'error');
                }
            }
        });
    });

    $(document).on('click', '.delete', function() {
        var id = $(this).data('id');
        if (!id) {
            showNotification('Invalid order ID', 'error');
            return;
        }
        $('#confirm_message').text('Are you sure you want to delete this order?');
        $('#confirm_button').text('Delete');
        $('#confirm_button').off('click').on('click', function() { handleDelete(id); }); // Bind the delete handler with the id
        $('#confirmModal').modal('show');
    });

    function handleDelete(id) {
        $.ajax({
            url: "/api/admin/orders/" + id,
            method: "DELETE",
            success: function(data) {
                $('#confirmModal').modal('hide');
                orderTable.ajax.reload();
                showNotification('Order has been successfully deleted!', 'success');
            },
            error: function(xhr) {
                $('#confirmModal').modal('hide');
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    showNotification('An error occurred: ' + xhr.responseJSON.error, 'error');
                } else {
                    showNotification('An error occurred.', 'error');
                }
            }
        });
    }

    $('#export_excel').on('click', function() {
        console.log('Export to Excel button clicked');
        var data = orderTable.rows({ search: 'applied' }).data().toArray();
        var formattedData = data.map(function(order) {
            return {
                ID: order.id,
                Customer: order.customer,
                Status: order.status,
                Payment_Method: order.payment_method,
                Courier: order.courier
            };
        });
        var ws = XLSX.utils.json_to_sheet(formattedData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
        XLSX.writeFile(wb, "orders.xlsx");
    });

    function showNotification(message, type) {
        var alertDiv = type === 'success' ? $('#success-alert') : $('#error-alert');
        var messageSpan = type === 'success' ? $('#success-message') : $('#error-message');
        
        messageSpan.html(message);
        alertDiv.fadeIn();

        setTimeout(function() {
            alertDiv.fadeOut();
        }, 10000);
    }
});
