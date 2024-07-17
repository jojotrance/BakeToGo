$(document).ready(function() {
    console.log('Document is ready');

    var courierTable = $('#courier_table').DataTable({
        data: [
            {id: 1, courier_name: 'Courier A', branch: 'Branch 1', image: 'image1.jpg'},
            {id: 2, courier_name: 'Courier B', branch: 'Branch 2', image: 'image2.jpg'},
            {id: 3, courier_name: 'Courier C', branch: 'Branch 3', image: 'image3.jpg'},
            {id: 4, courier_name: 'Courier D', branch: 'Branch 4', image: 'image4.jpg'},
            {id: 5, courier_name: 'Courier E', branch: 'Branch 5', image: 'image5.jpg'}
        ],
        columns: [
            { data: 'id', name: 'id' },
            { data: 'courier_name', name: 'courier_name' },
            { data: 'branch', name: 'branch' },
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
            searchPlaceholder: "Search couriers",
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

        if ($('#courier_name').val().trim() === '') {
            $('#courier_name_error').text('Courier Name is required');
            isValid = false;
        }
        if ($('#branch').val().trim() === '') {
            $('#branch_error').text('Branch is required');
            isValid = false;
        }
        if ($('#action_button_courier').text() === 'Create' && $('#image').val().trim() === '') {
            $('#image_error').text('Image is required');
            isValid = false;
        }

        return isValid;
    }

    $('#create_courier').on('click', function() {
        console.log('Create Courier button clicked');
        $('#courier_form')[0].reset();
        $('#modal_title_courier').text('Add New Courier');
        $('#action_button_courier').text('Create');
        $('#image').attr('required', true);
        $('.text-danger').text('');
        $('#courier_modal').modal('show');
    });

    $('#courier_form').on('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            $('#confirm_message').text('Are you sure you want to ' + ($('#action_button_courier').text() === 'Create' ? 'add this courier?' : 'update this courier?'));
            $('#confirm_button').text($('#action_button_courier').text() === 'Create' ? 'Add' : 'Update');
            $('#confirmModal').modal('show');
        }
    });

    $('#confirm_button').on('click', function() {
        $('#confirmModal').modal('hide');
        $('#courier_modal').modal('hide');
        showNotification('Courier has been successfully ' + ($('#action_button_courier').text() === 'Create' ? 'added!' : 'updated!'), 'success');
    });

    $(document).on('click', '.edit', function() {
        var id = $(this).data('id');
        var courier = courierTable.data().toArray().find(courier => courier.id == id);
        $('#courier_name').val(courier.courier_name);
        $('#branch').val(courier.branch);
        $('#hidden_id_courier').val(courier.id);
        $('#modal_title_courier').text('Edit Courier');
        $('#action_button_courier').text('Update');
        $('#image').attr('required', false);
        $('.text-danger').text('');
        $('#courier_modal').modal('show');
    });

    $(document).on('click', '.delete', function() {
        var id = $(this).data('id');
        $('#confirm_message').text('Are you sure you want to delete this courier?');
        $('#confirm_button').text('Delete');
        $('#confirmModal').modal('show');

        $('#confirm_button').off('click').on('click', function() {
            $('#confirmModal').modal('hide');
            setTimeout(function() {
                showNotification('Courier has been successfully deleted!', 'success');
            }, 1000);
        });
    });

    $('#export_excel').on('click', function() {
        console.log('Export to Excel button clicked');
        var data = courierTable.rows({ search: 'applied' }).data().toArray(); // Get all the data from the table
        var formattedData = data.map(function(courier) {
            return {
                ID: courier.id,
                Courier_Name: courier.courier_name,
                Branch: courier.branch,
                Image: courier.image
            };
        });
        var ws = XLSX.utils.json_to_sheet(formattedData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Couriers");
        XLSX.writeFile(wb, "couriers.xlsx");
    });
});