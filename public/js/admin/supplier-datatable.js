$(document).ready(function() {
    console.log('Document is ready');

    var supplierTable = $('#supplier_table').DataTable({
        data: [
            {id: 1, supplier_name: 'Supplier A', image: 'images/supplier_a.jpg'},
            {id: 2, supplier_name: 'Supplier B', image: 'images/supplier_b.jpg'},
            {id: 3, supplier_name: 'Supplier C', image: 'images/supplier_c.jpg'},
            {id: 4, supplier_name: 'Supplier D', image: 'images/supplier_d.jpg'},
            {id: 5, supplier_name: 'Supplier E', image: 'images/supplier_e.jpg'}
        ],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'supplier_name', name: 'supplier_name' },
            { 
                data: 'image', 
                name: 'image', 
                render: function(data) {
                    return '<img src="' + data + '" class="img-thumbnail" width="50" />';
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
            searchPlaceholder: "Search suppliers",
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

        if ($('#supplier_name').val().trim() === '') {
            $('#supplier_name_error').text('Name is required');
            isValid = false;
        }
        if ($('#action_button_supplier').text() === 'Create' && $('#image').val().trim() === '') {
            $('#image_error').text('Image is required');
            isValid = false;
        }

        return isValid;
    }

    $('#create_supplier').on('click', function() {
        console.log('Create Supplier button clicked');
        $('#supplier_form')[0].reset();
        $('#modal_title_supplier').text('Add New Supplier');
        $('#action_button_supplier').text('Create');
        $('#image').attr('required', true);
        $('.text-danger').text('');
        $('#supplier_modal').modal('show');
    });

    $('#supplier_form').on('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            $('#confirm_message').text('Are you sure you want to ' + ($('#action_button_supplier').text() === 'Create' ? 'add this supplier?' : 'update this supplier?'));
            $('#confirm_button').text($('#action_button_supplier').text() === 'Create' ? 'Add' : 'Update');
            $('#confirmModal').modal('show');
        }
    });

    $('#confirm_button').on('click', function() {
        $('#confirmModal').modal('hide');
        var formData = new FormData($('#supplier_form')[0]);
        var url = ($('#action_button_supplier').text() === 'Create') ? '/api/suppliers' : '/api/suppliers/' + $('#hidden_id_supplier').val();
        var method = ($('#action_button_supplier').text() === 'Create') ? 'POST' : 'PUT';

        // Simulate AJAX call success for dummy data
        showNotification('Supplier has been successfully ' + ($('#action_button_supplier').text() === 'Create' ? 'added!' : 'updated!'), 'success');
        supplierTable.ajax.reload();
        $('#supplier_modal').modal('hide');
        
        /*
        $.ajax({
            url: url,
            method: method,
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                showNotification('Supplier has been successfully ' + ($('#action_button_supplier').text() === 'Create' ? 'added!' : 'updated!'), 'success');
                supplierTable.ajax.reload();
                $('#supplier_modal').modal('hide');
            },
            error: function(xhr, status, error) {
                showNotification('An error occurred while ' + ($('#action_button_supplier').text() === 'Create' ? 'adding' : 'updating') + ' the supplier. Please try again.', 'error');
            }
        });
        */
    });

    $(document).on('click', '.edit', function() {
        var id = $(this).data('id');
        var supplier = supplierTable.data().toArray().find(supplier => supplier.id == id);
        $('#supplier_name').val(supplier.supplier_name);
        $('#hidden_id_supplier').val(supplier.id);
        $('#modal_title_supplier').text('Edit Supplier');
        $('#action_button_supplier').text('Update');
        $('#image').attr('required', false);
        $('.text-danger').text('');
        $('#supplier_modal').modal('show');
    });

    $(document).on('click', '.delete', function() {
        var id = $(this).data('id');
        $('#confirm_message').text('Are you sure you want to delete this supplier?');
        $('#confirm_button').text('Delete');
        $('#confirmModal').modal('show');

        $('#confirm_button').off('click').on('click', function() {
            $('#confirmModal').modal('hide');
            setTimeout(function() {
                // Simulate deletion success
                showNotification('Supplier has been successfully deleted!', 'success');
                supplierTable.ajax.reload();
            }, 1000);
        });
    });

    $('#export_excel').on('click', function() {
        console.log('Export to Excel button clicked');
        var data = supplierTable.rows({ search: 'applied' }).data().toArray(); // Get all the data from the table
        var formattedData = data.map(function(supplier) {
            return {
                ID: supplier.id,
                Name: supplier.supplier_name,
                Image: supplier.image
            };
        });
        var ws = XLSX.utils.json_to_sheet(formattedData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
        XLSX.writeFile(wb, "suppliers.xlsx");
    });
});
