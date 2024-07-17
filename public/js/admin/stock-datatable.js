$(document).ready(function() {
    console.log('Document is ready');

    var stockTable = $('#stock_table').DataTable({
        data: [
            {id: 1, quantity: 100, supplier: {supplier_name: 'Supplier A'}},
            {id: 2, quantity: 200, supplier: {supplier_name: 'Supplier B'}},
            {id: 3, quantity: 150, supplier: {supplier_name: 'Supplier C'}},
            {id: 4, quantity: 300, supplier: {supplier_name: 'Supplier A'}},
            {id: 5, quantity: 250, supplier: {supplier_name: 'Supplier B'}}
        ],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'quantity', name: 'quantity' },
            { data: 'supplier.supplier_name', name: 'supplier' },
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
        $('#stock_modal').modal('show');
    });

    $('#stock_form').on('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            $('#custom_confirm_message').text($('#action_button').text() === 'Create' ? 'Do you want to add this stock?' : 'Do you want to confirm the edit for this stock?');
            $('#custom_confirm_button').text($('#action_button').text() === 'Create' ? 'Add' : 'Confirm Edit');
            $('#customConfirmModal').modal('show');
        }
    });

    $('#custom_confirm_button').on('click', function() {
        $('#customConfirmModal').modal('hide');
        $('#stock_modal').modal('hide');
        showNotification('Stock has been successfully ' + ($('#action_button').text() === 'Create' ? 'added!' : 'updated!'), 'success');
    });

    $(document).on('click', '.edit', function() {
        var id = $(this).data('id');
        var stock = stockTable.row($(this).parents('tr')).data();
        $('#quantity').val(stock.quantity);
        $('#supplier_id').val(stock.supplier.supplier_name); // Make sure this is the supplier ID or adjust accordingly
        $('#hidden_id').val(stock.id);
        $('#modal_title').text('Edit Stock');
        $('#action_button').text('Update');
        $('.text-danger').text('');
        $('#stock_modal').modal('show');
    });

    $(document).on('click', '.delete', function() {
        var id = $(this).data('id');
        $('#delete_confirm_message').text('Are you sure you want to delete this stock entry?');
        $('#delete_confirm_button').text('Delete');
        $('#confirmDeleteModal').modal('show');

        $('#delete_confirm_button').off('click').on('click', function() {
            $('#confirmDeleteModal').modal('hide');
            showNotification('Stock has been successfully deleted!', 'success');
            stockTable.row($(this).parents('tr')).remove().draw();
        });
    });

    $('#export_excel').on('click', function() {
        console.log('Export to Excel button clicked');
        var data = stockTable.rows({ search: 'applied' }).data().toArray(); // Get all the data from the table
        var formattedData = data.map(function(stock) {
            return {
                ID: stock.id,
                Quantity: stock.quantity,
                Supplier: stock.supplier.supplier_name
            };
        });
        var ws = XLSX.utils.json_to_sheet(formattedData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Stocks");
        XLSX.writeFile(wb, "stocks.xlsx");
    });
});
