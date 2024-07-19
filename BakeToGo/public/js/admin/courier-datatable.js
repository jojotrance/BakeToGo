$(function() {
    console.log('Courier Page is ready');

    // Initialize DataTable for couriers
    var courierTable = $('#courier_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/api/couriers",
            type: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataSrc: function(json) {
                console.log('Courier data:', json.data);
                return json.data;
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                console.error('Response Text:', xhr.responseText);
                showNotification('Failed to load couriers. Please try again.', 'error');
            }
        },
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
        }
    });

    // Create Courier button click event
    $(document).on('click', '#create_courier', function() {
        console.log('Create Courier button clicked');
        $('#courier_form')[0].reset();
        $('#modal_title_courier').text('Add New Courier');
        $('#action_button_courier').text('Create');
        $('#image').attr('required', true);
        $('.text-danger').text('');
        $('#courier_modal').modal('show');
    });

    // Handle Add/Edit modal actions
    $('#courier_form').on('submit', function(event) {
        event.preventDefault();
        if (!validateForm()) return;

        var action_url = $('#action_button_courier').text() === 'Update' ? 
                        "/api/couriers/" + $('#hidden_id_courier').val() : 
                        "/api/couriers";
        var method = $('#action_button_courier').text() === 'Update' ? 'POST' : 'POST';
        var formData = new FormData(this);

        if ($('#action_button_courier').text() === 'Update') {
            formData.append('_method', 'PUT');
        }

        $.ajax({
            url: action_url,
            method: method,
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                console.log('Submit response:', data);
                if (data.message) {
                    $('#courier_modal').modal('hide');
                    courierTable.ajax.reload(null, false);
                    showNotification(data.message, 'success');
                    $('#courier_form')[0].reset();
                } else {
                    showModalNotification(data.error || 'An error occurred', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                console.log('Response:', xhr.responseText);
                showModalNotification('An error occurred. Please try again.', 'error');
            }
        });
    });

    // Handle Edit action
    $(document).on('click', '.edit', function() {
        var id = $(this).data('id');
        console.log('Edit button clicked for courier ID:', id);

        $('#courier_form').find('.text-danger').html('');

        $.ajax({
            url: "/api/couriers/" + id,
            method: 'GET',
            dataType: 'json',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                console.log('Edit Data:', response);
                if (response.data) {
                    var courier = response.data;
                    $('#courier_name').val(courier.courier_name || '');
                    $('#branch').val(courier.branch || '');
                    $('#hidden_id_courier').val(courier.id || '');
                    if (courier.image) {
                        $('#image_preview').attr('src', '/storage/' + courier.image).show();
                    } else {
                        $('#image_preview').hide();
                    }
                    $('#modal_title_courier').text('Edit Courier');
                    $('#action_button_courier').text('Update');
                    $('#image').attr('required', false);
                    $('#courier_modal').modal('show');
                } else {
                    showModalNotification('Failed to load courier details.', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                console.log('Response:', xhr.responseText);
                showModalNotification('Failed to load courier details.', 'error');
            }
        });
    });

    // Handle Delete action
    $(document).on('click', '.delete', function() {
        var id = $(this).data('id');
        console.log('Delete button clicked for courier ID:', id);

        $('#confirm_message').text('Are you sure you want to delete this courier?');
        $('#confirm_button').text('Delete');
        $('#confirmModal').modal('show');

        $('#confirm_button').off('click').on('click', function() {
            $('#confirmModal').modal('hide');
            $.ajax({
                url: "/api/couriers/" + id,
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(data) {
                    console.log('Delete response:', data);
                    courierTable.ajax.reload(null, false);
                    showNotification('Courier has been successfully deleted!', 'success');
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', error);
                    console.log('Response:', xhr.responseText);
                    showNotification('An error occurred while deleting the courier. Please try again.', 'error');
                }
            });
        });
    });

    // Handle Export to Excel action
    $('#export_excel').on('click', function() {
        console.log('Export to Excel button clicked');
        var data = courierTable.rows({ search: 'applied' }).data().toArray();
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

    function showNotification(message, type) {
        var alertDiv = type === 'success' ? $('#success-alert') : $('#error-alert');
        var messageSpan = type === 'success' ? $('#success-message') : $('#error-message');
        
        messageSpan.text(message);
        alertDiv.fadeIn();

        setTimeout(function() {
            alertDiv.fadeOut();
        }, 4000);
    }

    function showModalNotification(message, type) {
        var alertDiv = type === 'success' ? '<div class="alert alert-success">' : '<div class="alert alert-danger">';
        alertDiv += message + '</div>';
        
        $('#courier_modal .modal-body').prepend(alertDiv);

        setTimeout(function() {
            $('#courier_modal .alert').remove();
        }, 4000);
    }

    function validateForm() {
        let isValid = true;
        $('.text-danger').text('');

        if ($('#courier_name').val().trim() === '') {
            $('#courier_name_error').text('Name is required');
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
});
