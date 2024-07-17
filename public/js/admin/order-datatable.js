$(document).ready(function() {
    console.log('Document is ready');

    var orderTable = $('#order_table').DataTable({
        data: [
            {id: 1, customer: {name: 'Customer A'}, status: 'Pending', payment_method: 'GCash', courier: 'FedEx'},
            {id: 2, customer: {name: 'Customer B'}, status: 'Completed', payment_method: 'COD', courier: 'DHL'},
            {id: 3, customer: {name: 'Customer C'}, status: 'Shipped', payment_method: 'Credit', courier: 'Amazon'},
            {id: 4, customer: {name: 'Customer D'}, status: 'Cancelled', payment_method: 'Amazon Pay', courier: 'FedEx'},
            {id: 5, customer: {name: 'Customer E'}, status: 'Pending', payment_method: 'ApplePay', courier: 'DHL'}
        ],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'customer.name', name: 'customer' },
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
        },
    });

    function validateForm() {
        let isValid = true;
        $('.text-danger').text('');  // Clear previous error messages

        if ($('#customer_id').val().trim() === '') {
            $('#customer_id_error').text('Customer is required');
            isValid = false;
        }
        if ($('#status').val().trim() === '') {
            $('#status_error').text('Status is required');
            isValid = false;
        }
        if ($('#payment_method').val().trim() === '') {
            $('#payment_method_error').text('Payment Method is required');
            isValid = false;
        }
        if ($('#courier').val().trim() === '') {
            $('#courier_error').text('Courier is required');
            isValid = false;
        }

        return isValid;
    }

    $('#create_order').on('click', function() {
        console.log('Create Order button clicked');
        $('#order_form')[0].reset();
        $('#modal_title').text('Add New Order');
        $('#action_button').text('Create');
        $('.text-danger').text('');
        $('#order_modal').modal('show');
    });

    $('#order_form').on('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            $('#confirm_message').text('Are you sure you want to ' + ($('#action_button').text() === 'Create' ? 'add this order?' : 'update this order?'));
            $('#confirm_button').text($('#action_button').text() === 'Create' ? 'Add' : 'Update');
            $('#confirmModal').modal('show');
        }
    });

    $('#confirm_button').on('click', function() {
        $('#confirmModal').modal('hide');
        $('#order_modal').modal('hide');
        showNotification('Order has been successfully ' + ($('#action_button').text() === 'Create' ? 'added!' : 'updated!'), 'success');
    });

    $(document).on('click', '.edit', function() {
        var id = $(this).data('id');
        var order = orderTable.data().toArray().find(order => order.id == id);
        $('#customer_id').val(order.customer.name);
        $('#status').val(order.status.toLowerCase());
        $('#payment_method').val(order.payment_method.toLowerCase().replace(' ', ''));
        $('#courier').val(order.courier);
        $('#hidden_id').val(order.id);
        $('#modal_title').text('Edit Order');
        $('#action_button').text('Update');
        $('.text-danger').text('');
        $('#order_modal').modal('show');
    });

    $(document).on('click', '.delete', function() {
        var id = $(this).data('id');
        $('#confirm_message').text('Are you sure you want to delete this order?');
        $('#confirm_button').text('Delete');
        $('#confirmModal').modal('show');

        $('#confirm_button').off('click').on('click', function() {
            $('#confirmModal').modal('hide');
            showNotification('Order has been successfully deleted!', 'success');
        });
    });

    $('#export_excel').on('click', function() {
        console.log('Export to Excel button clicked');
        var data = orderTable.rows({ search: 'applied' }).data().toArray(); // Get all the data from the table
        var formattedData = data.map(function(order) {
            return {
                ID: order.id,
                Customer: order.customer.name,
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
        }, 4000);
    }
});