jQuery(document).ready(function($) {
    console.log('DataTable Initialization');

    var dataTable;

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
                    alert('An error occurred while fetching user data. Please try again.');
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
                        return `<span class="editable role" data-id="${full.id}" data-role="${data}">${data === 'admin' ? 'Admin' : data === 'customer' ? 'Customer' : 'Guest'}</span>`;
                    }
                },
                {
                    data: 'active_status',
                    name: 'active_status',
                    width: '5%',
                    render: function(data, type, full, meta) {
                        return `<span class="editable active_status" data-id="${full.id}" data-status="${data}"><span class="chip ${data ? 'chip-active' : 'chip-inactive'}">${data ? 'Active' : 'Inactive'}</span></span>`;
                    }
                },
                {
                    data: null,
                    width: '10%',
                    render: function(data, type, row) {
                        return '<div class="action-buttons"><button type="button" class="delete-user btn btn-danger btn-sm" data-id="' + row.id + '">Delete</button></div>';
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

    var currentEdit = null;

    // Function to handle save action for role
    function saveRole(id, value, $row) {
        $.ajax({
            url: `/api/admin/users/${id}/role`,
            type: 'PUT',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: { role: value },
            success: function(response) {
                if (dataTable && dataTable.ajax) {
                    dataTable.ajax.reload(null, false);
                }
                currentEdit = null;
                console.log('Role updated:', response);
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                console.error('Response Text:', xhr.responseText);
                alert('Failed to update role.');
            }
        });

        // Restore the action buttons
        $row.find('.action-buttons').html('<button type="button" class="delete-user btn btn-danger btn-sm" data-id="' + id + '">Delete</button>');
    }

    // Function to handle save action for active status
    function saveActiveStatus(id, value, $row) {
        $.ajax({
            url: `/api/admin/users/${id}/active-status`,
            type: 'PUT',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: { active_status: value },
            success: function(response) {
                if (dataTable && dataTable.ajax) {
                    dataTable.ajax.reload(null, false);
                }
                currentEdit = null;
                console.log('Active status updated:', response);
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
                console.error('Response Text:', xhr.responseText);
                alert('Failed to update active status.');
            }
        });

        // Restore the action buttons
        $row.find('.action-buttons').html('<button type="button" class="delete-user btn btn-danger btn-sm" data-id="' + id + '">Delete</button>');
    }

    // Function to cancel the edit
    function cancelEdit($row, originalContent) {
        currentEdit.html(originalContent);
        currentEdit = null;

        // Restore the action buttons
        $row.find('.action-buttons').html('<button type="button" class="delete-user btn btn-danger btn-sm" data-id="' + $row.find('.editable').data('id') + '">Delete</button>');
    }

    // Edit role on double-click
    $(document).on('dblclick', '.editable.role', function() {
        if (currentEdit) return; // Prevent editing multiple fields at the same time

        let $this = $(this);
        let currentRole = $this.data('role');
        let id = $this.data('id');
        let $row = $this.closest('tr');
        let roleOptions = '<select class="form-control role-dropdown"><option value="customer" ' + (currentRole === 'customer' ? 'selected' : '') + '>Customer</option><option value="admin" ' + (currentRole === 'admin' ? 'selected' : '') + '>Admin</option><option value="guest" ' + (currentRole === 'guest' ? 'selected' : '') + '>Guest</option></select>';
        let originalContent = $this.html();

        $this.html(roleOptions);
        currentEdit = $this;

        // Replace action buttons with Save and Cancel
        $row.find('.action-buttons').html('<button type="button" class="btn btn-success btn-sm save-btn">Save</button><button type="button" class="btn btn-secondary btn-sm cancel-btn">Cancel</button>');

        $this.find('select').focus();

        // Handle Save and Cancel actions
        $row.find('.save-btn').on('click', function() {
            let newRole = $this.find('select').val();
            if (newRole !== currentRole) {
                saveRole(id, newRole, $row);
            } else {
                $this.html(currentRole === 'admin' ? 'Admin' : currentRole === 'customer' ? 'Customer' : 'Guest');
                currentEdit = null;
                // Restore the action buttons
                $row.find('.action-buttons').html('<button type="button" class="delete-user btn btn-danger btn-sm" data-id="' + id + '">Delete</button>');
            }
        });

        $row.find('.cancel-btn').on('click', function() {
            cancelEdit($row, originalContent);
        });
    });

    // Edit active status on double-click
    $(document).on('dblclick', '.editable.active_status', function() {
        if (currentEdit) return; // Prevent editing multiple fields at the same time

        let $this = $(this);
        let currentStatus = $this.data('status');
        let id = $this.data('id');
        let $row = $this.closest('tr');
        let statusOptions = '<select class="form-control status-dropdown"><option value="1" ' + (currentStatus ? 'selected' : '') + '>Active</option><option value="0" ' + (!currentStatus ? 'selected' : '') + '>Inactive</option></select>';
        let originalContent = $this.html();

        $this.html(statusOptions);
        currentEdit = $this;

        // Replace action buttons with Save and Cancel
        $row.find('.action-buttons').html('<button type="button" class="btn btn-success btn-sm save-btn">Save</button><button type="button" class="btn btn-secondary btn-sm cancel-btn">Cancel</button>');

        $this.find('select').focus();

        // Handle Save and Cancel actions
        $row.find('.save-btn').on('click', function() {
            let newStatus = $this.find('select').val();
            if (newStatus != currentStatus) {
                saveActiveStatus(id, newStatus, $row);
            } else {
                $this.html('<span class="chip ' + (currentStatus ? 'chip-active' : 'chip-inactive') + '">' + (currentStatus ? 'Active' : 'Inactive') + '</span>');
                currentEdit = null;
                // Restore the action buttons
                $row.find('.action-buttons').html('<button type="button" class="delete-user btn btn-danger btn-sm" data-id="' + id + '">Delete</button>');
            }
        });

        $row.find('.cancel-btn').on('click', function() {
            cancelEdit($row, originalContent);
        });
    });

    // Handle Delete action
    $(document).on('click', '.delete-user', function() {
        var id = $(this).data('id');
        if (confirm("Are you sure you want to delete this user?")) {
            $.ajax({
                url: `/api/admin/users/${id}`,
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
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
