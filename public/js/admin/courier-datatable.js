$(document).ready(function() {
    console.log('Courier Page is ready');

    var courierTable = $('#courier_table').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "/api/admin/couriers/list",
            type: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataSrc: function(json) {
                return json.data;
            },
            error: function(xhr, status, error) {
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
                    return data ? '<img src="/storage/' + data + '" class="img-thumbnail" width="50" />' : 'No Image';
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, full, meta) {
                    return '<button type="button" class="edit-courier btn btn-primary btn-sm" data-id="' + full.id + '">Edit</button> ' +
                           '<button type="button" class="delete-courier btn btn-danger btn-sm" data-id="' + full.id + '">Delete</button>';
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

    // Handle Create Courier Button
    $(document).on('click', '#create_courier', function() {
        $('#courier_form')[0].reset();
        $('#modal_title_courier').text('Add New Courier');
        $('#action_button_courier').text('Create');
        $('#image').attr('required', true);
        $('.text-danger').text('');
        $('#image_preview').hide();
        $('#courier_modal').modal('show');
    });

    // Handle Form Submission
    $('#courier_form').on('submit', function(event) {
        event.preventDefault();
        if (!validateForm()) return;

        var action_url = $('#action_button_courier').text() === 'Update' ? 
                        "/api/admin/couriers/update/" + $('#hidden_id_courier').val() : 
                        "/api/admin/couriers/create";
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
                if (data.data) {
                    $('#courier_modal').modal('hide');
                    courierTable.ajax.reload(null, false);
                    showNotification('Courier has been successfully ' + ($('#action_button_courier').text() === 'Update' ? 'updated' : 'created') + '!', 'success');
                    $('#courier_form')[0].reset();
                } else {
                    showModalNotification(data.error || 'An error occurred', 'error');
                }
            },
            error: function(xhr, status, error) {
                showModalNotification('An error occurred. Please try again.', 'error');
            }
        });
    });

    // Handle Edit Courier Button
    $(document).on('click', '.edit-courier', function() {
        var id = $(this).data('id');
        console.log('Edit courier ID:', id); // Log the ID to ensure it's correct
        $('#courier_form').find('.text-danger').html('');

        $.ajax({
            url: "/api/admin/couriers/view/" + id,
            method: 'GET',
            dataType: 'json',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
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
                showModalNotification('Failed to load courier details.', 'error');
            }
        });
    });

    // Handle Delete Courier Button
    $(document).on('click', '.delete-courier', function() {
        var id = $(this).data('id');
        console.log('Delete courier ID:', id); // Log the ID to ensure it's correct
        $('#confirm_message').text('Are you sure you want to delete this courier?');
        $('#confirm_button').text('Delete');
        $('#confirmModal').modal('show');

        $('#confirm_button').off('click').on('click', function() {
            $('#confirmModal').modal('hide');
            $.ajax({
                url: "/api/admin/couriers/destroy/" + id,
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(data) {
                    $('#courier_table').DataTable().ajax.reload(null, false);
                    showNotification('Courier has been successfully deleted!', 'success');
                },
                error: function(xhr, status, error) {
                    showNotification('An error occurred while deleting the courier. Please try again.', 'error');
                }
            });
        });
    });

    // Handle Export to Excel Button
    $('#export_excel').on('click', function() {
        var data = courierTable.rows({ search: 'applied' }).data().toArray();
        var formattedData = data.map(function(courier) {
            return {
                ID: courier.id,
                Courier_Name: courier.courier_name,
                Branch: courier.branch,
                Image: shortenUrl(courier.image ? '/storage/' + courier.image : 'No Image')
            };
        });
        var ws = XLSX.utils.json_to_sheet(formattedData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Couriers");
        XLSX.writeFile(wb, "couriers.xlsx");
    });

    // Utility Functions
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

    $('#image').on('change', function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#image_preview').attr('src', e.target.result).show();
            }
            reader.readAsDataURL(file);
        }
    });

    function shortenUrl(url) {
        const maxLength = 30;
        if (!url) {
            return 'No Image';
        }
        if (url.length <= maxLength) {
            return url;
        }
        return url.substring(0, maxLength) + '...';
    }
});
