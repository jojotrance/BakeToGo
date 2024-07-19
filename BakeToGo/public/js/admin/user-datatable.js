$(document).ready(function() {
    console.log('DataTable Initialization');

    var dataTable;

    // Initialize DataTable if not already initialized
    if (!$.fn.DataTable.isDataTable('#datatable')) {
        dataTable = $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/admin/users",
                type: "GET",
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: function(d) {
                    d.search = $('input[type="search"]').val();
                },
                dataSrc: function(json) {
                    console.log('JSON Response:', json);
                    if (!json || !json.data) {
                        console.error("Invalid JSON response:", json);
                        return [];
                    }
                    return json.data;
                },
                error: function(xhr, error, thrown) {
                    console.error("Error in fetching data: ", xhr.responseText);
                }
            },
            columns: [
                { data: 'id', name: 'id', width: '5%' },
                {
                    data: 'profile_image',
                    name: 'profile_image',
                    width: '10%',
                    render: function(data, type, full, meta) {
                        if (type === 'display') {
                            return '<img src="' + (data ? data : '/images/default-placeholder.png') + '" alt="Profile Image" class="img-thumbnail rounded-circle" width="30" height="30">';
                        }
                        return data;
                    }
                },
                { data: 'name', name: 'name', title: 'Username', width: '10%' },
                { data: 'fname', name: 'fname', title: 'First Name', width: '10%' },
                { data: 'lname', name: 'lname', title: 'Last Name', width: '10%' },
                { data: 'email', name: 'email', width: '15%' },
                { data: 'contact', name: 'contact', width: '10%' },
                { data: 'address', name: 'address', width: '20%' },
                {
                    data: 'role',
                    name: 'role',
                    width: '5%',
                    render: function(data, type, full, meta) {
                        return data === 'admin' ? 'Admin' : 'Customer';
                    }
                },
                {
                    data: 'active_status',
                    name: 'active_status',
                    width: '5%',
                    render: function(data, type, full, meta) {
                        return '<span class="chip ' + (data ? 'chip-active' : 'chip-inactive') + '">' + (data ? 'Active' : 'Inactive') + '</span>';
                    }
                },
                {
                    data: null,
                    width: '10%',
                    render: function(data, type, row) {
                        return '<button class="btn btn-icon edit" data-id="' + row.id + '"><i class="fas fa-edit" style="color: green;"></i></button> ' +
                            '<button class="btn btn-icon delete" data-id="' + row.id + '"><i class="fas fa-trash" style="color: red;"></i></button>';
                    }
                }
            ],
            searching: true,
            language: {
                emptyTable: "No data available in table",
                info: "Showing _START_ to _END_ of _TOTAL_ entries",
                infoEmpty: "Showing 0 to 0 of 0 entries",
                lengthMenu: "Show _MENU_ entries",
                loadingRecords: "Loading...",
                processing: "Processing...",
                search: "Search:",
                zeroRecords: "No matching records found"
            },
            order: [[0, "desc"]],
            scrollY: "60vh",
            scrollCollapse: true,
            paging: true
        });
    }

    // Custom sorting for First Name column using insertion sort
    $.fn.dataTable.ext.order['insertion-sort'] = function(settings, col) {
        return this.api().column(col, { order: 'index' }).nodes().map(function(td, i) {
            return $(td).text();
        }).sort(function(a, b) {
            return a.localeCompare(b);
        });
    };

    // Enable custom sorting on 'First Name' column
    $('#datatable').on('click', 'th:contains("First Name")', function() {
        dataTable.order([3, 'insertion-sort']).draw();
    });

    // Handle cell click to show full text
    $('#datatable tbody').on('click', 'td', function() {
        var cellData = dataTable.cell(this).data();
        $('#text_modal_body').text(cellData);
        $('#text_modal').modal('show');
    });

    // Handle Add/Edit modal actions
    $('#sample_form').on('submit', function(event) {
        event.preventDefault();
        var action_url = "/api/admin/users";

        if ($('#action').val() === 'Edit') {
            action_url = "/api/admin/users/" + $('#id').val();
        }

        var formData = {
            id: $('#id').val(),
            active_status: $('#active_status').val(),
            role: $('#role').val(),
            action: $('#action').val()
        };

        console.log('Form Data:', formData);

        $.ajax({
            url: action_url,
            method: $('#action').val() === 'Edit' ? "PUT" : "POST",
            data: formData,
            dataType: "json",
            success: function(data) {
                if (data.errors) {
                    $.each(data.errors, function(key, value) {
                        $('#' + key + '_error').html(value);
                    });
                }

                if (data.success) {
                    if (dataTable && dataTable.ajax) {
                        dataTable.ajax.reload(null, false);
                    }
                    $('#action_modal').modal('hide');
                    $('#sample_form')[0].reset();
                    $('#message').html('<div class="alert alert-success">' + data.success + '</div>');
                    setTimeout(function() {
                        $('#message').html('');
                    }, 5000);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                console.log('Response:', xhr.responseText);
                alert('An error occurred while processing your request. Please try again.');
            }
        });
    });

    // Handle Edit action
    $(document).on('click', '.edit', function() {
        var id = $(this).data('id');

        $('#sample_form').find('.text-danger').html('');

        $.ajax({
            url: "/api/admin/users/" + id,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log('Edit Data:', data);
                $('#name').val(data.name).prop('disabled', true);
                $('#role').val(data.role === 'admin' ? 'admin' : 'customer');
                $('#active_status').val(data.active_status == 1 ? 1 : 0);
                $('#id').val(id);
                $('#dynamic_modal_title').text('Edit User');
                $('#action_button').text('Edit');
                $('#action').val('Edit');
                $('#action_modal').modal('show');
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                console.log('Response:', xhr.responseText);
                alert('An error occurred while fetching user data. Please try again.');
            }
        });
    });

    // Handle Delete action
    $(document).on('click', '.delete', function() {
        var id = $(this).data('id');
        if (confirm("Are you sure you want to delete this user?")) {
            $.ajax({
                url: "/api/admin/users/" + id,
                method: 'DELETE',
                data: { id: id },
                dataType: 'json',
                success: function(data) {
                    if (dataTable && dataTable.ajax) {
                        dataTable.ajax.reload(null, false);
                    }
                    $('#message').html('<div class="alert alert-success">' + data.success + '</div>');
                    setTimeout(function() {
                        $('#message').html('');
                    }, 5000);
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', error);
                    console.log('Response:', xhr.responseText);
                    alert('An error occurred while deleting the user. Please try again.');
                }
            });
        }
    });

    // Handle Import action
    $('#import_excel').click(function() {
        $('#import_form')[0].reset();
        $('#import_message').html('');
        $('#import_modal').modal('show');
    });

    $('#import_form').on('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: "/api/admin/users/import",
            method: "POST",
            data: formData,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function(data) {
                if (data.errors) {
                    $('#import_message').html('<div class="alert alert-danger">' + data.errors + '</div>');
                }

                if (data.success) {
                    if (dataTable && dataTable.ajax) {
                        dataTable.ajax.reload(null, false);
                    }
                    $('#import_message').html('<div class="alert alert-success">' + data.success + '</div>');
                    setTimeout(function() {
                        $('#import_message').html('');
                        $('#import_modal').modal('hide');
                    }, 5000);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                console.log('Response:', xhr.responseText);
                alert('An error occurred while importing the data. Please try again.');
            }
        });
    });

    // Clear Import modal data
    $('#clear_import_data').click(function() {
        $('#file').val('');
        $('#import_message').html('');
    });

    // Handle Export action
    $('#export_excel').click(function() {
        window.location.href = "/api/admin/users/export";
    });
});
