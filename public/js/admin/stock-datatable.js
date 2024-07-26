
$(document).ready(function() {
    console.log('Document is ready');

    function initializeStockTable() {
        $('#stock_table').DataTable({
            processing: true,
            serverSide: true,
            retrieve: true,
            ajax: {
                url: "/api/admin/stocks",
                type: 'GET',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                dataSrc: function(json) {
                    console.log("Received data:", json);
                    if (!json.data) {
                        console.error("Invalid JSON response:", json);
                        return [];
                    }
                    return json.data;
                },
                error: function(xhr, status, error) {
                    showNotification('Failed to load stocks. Please try again.', 'error');
                    console.error('AJAX Error:', status, error);
                    console.error('Response Text:', xhr.responseText);
                }
            },
            columns: [
                { 
                    data: 'product_name',  
                    name: 'product_name',
                    render: function(data, type, row) {
                        return data || 'N/A';
                    }
                },
                { 
                    data: 'quantity', 
                    name: 'quantity',
                    render: function(data, type, row) {
                        return `<span class="editable quantity" data-id="${row.id}">${data || '0'}</span>`;
                    }
                },
                { 
                    data: 'supplier_name', 
                    name: 'supplier_name',
                    render: function(data, type, row) {
                        return `<span class="editable supplier" data-id="${row.id}" data-supplier-id="${row.supplier_id}">${data || 'N/A'}</span>`;
                    }
                },
                { 
                    data: null, 
                    orderable: false, 
                    searchable: false,
                    render: function(data, type, full, meta) {
                        return '<button type="button" class="delete-stock btn btn-danger btn-sm" data-id="' + full.id + '">Delete</button>';
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
    }

    // Initialize the stock DataTable on document ready
    initializeStockTable();

    // Load suppliers for dropdown
    function loadSuppliers() {
        return $.ajax({
            url: "/api/admin/suppliers",
            type: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        }).then(function(response) {
            if (response.data) {
                let options = '<option value="">Select Supplier</option>';
                $.each(response.data, function(index, supplier) {
                    options += `<option value="${supplier.id}">${supplier.supplier_name}</option>`;
                });
                return options;
            }
        }).catch(function(xhr, status, error) {
            showNotification('Failed to load suppliers. Please try again.', 'error');
            console.error('AJAX Error:', status, error);
            console.error('Response Text:', xhr.responseText);
        });
    }

    // Load products for dropdown
    function loadProducts() {
        return $.ajax({
            url: "/api/admin/products",
            type: 'GET',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        }).then(function(response) {
            if (response.data) {
                let options = '<option value="">Select Product</option>';
                $.each(response.data, function(index, product) {
                    options += `<option value="${product.id}">${product.name}</option>`;
                });
                return options;
            }
        }).catch(function(xhr, status, error) {
            showNotification('Failed to load products. Please try again.', 'error');
            console.error('AJAX Error:', status, error);
            console.error('Response Text:', xhr.responseText);
        });
    }

    // Add new row for creating stock
    $('#create_stock').on('click', async function() {
        let productOptions = await loadProducts();
        let supplierOptions = await loadSuppliers();

        let newRow = `
            <tr class="new-stock-row">
                <td>
                    <select class="form-control select2 product-select">${productOptions}</select>
                </td>
                <td>
                    <input type="number" class="form-control new-quantity" />
                </td>
                <td>
                    <select class="form-control select2 supplier-select">${supplierOptions}</select>
                </td>
                <td>
                    <button type="button" class="btn btn-success btn-sm save-new-stock">Save</button>
                    <button type="button" class="btn btn-danger btn-sm cancel-new-stock">Cancel</button>
                </td>
            </tr>
        `;

        $('#stock_table tbody').prepend(newRow);
        $('.select2').select2();

        // Cancel new stock creation
        $('.cancel-new-stock').on('click', function() {
            $(this).closest('tr').remove();
        });

        // Save new stock
        $('.save-new-stock').on('click', function() {
            let $row = $(this).closest('tr');
            let product_id = $row.find('.product-select').val();
            let quantity = $row.find('.new-quantity').val();
            let supplier_id = $row.find('.supplier-select').val();

            if (!product_id || !quantity || !supplier_id) {
                showNotification('All fields are required', 'error');
                return;
            }

            if (!supplier_id && quantity > 0) {
                showNotification('You must select a supplier if you add a quantity.', 'error');
                return;
            }

            // Validate if the same supplier is already assigned to the same product
            if (isSupplierProductExist(product_id, supplier_id)) {
                showNotification('The same supplier cannot be assigned to the same product.', 'error');
                return;
            }

            $.ajax({
                url: "/api/admin/stocks",
                type: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: {
                    product_id: product_id,
                    quantity: quantity,
                    supplier_id: supplier_id
                },
                success: function(response) {
                    $('#stock_table').DataTable().ajax.reload();
                    showNotification('Stock has been successfully created!', 'success');
                    console.log('New stock saved:', response);
                },
                error: function(xhr, status, error) {
                    showNotification('Failed to save stock. Please try again.', 'error');
                    console.error('AJAX Error:', status, error);
                    console.error('Response Text:', xhr.responseText);
                }
            });
        });
    });

    // Edit quantity on double-click
    $(document).on('dblclick', '.editable.quantity', function() {
        let $this = $(this);
        let currentValue = $this.text().trim();
        let id = $this.data('id');
        $this.html(`<input type="number" class="form-control" value="${currentValue}" />`);
        let $input = $this.find('input');

        $input.focus().on('blur keydown', function(event) {
            if (event.type === 'blur' || event.key === 'Enter') {
                let newValue = $(this).val().trim();
                if (newValue === '') {
                    newValue = currentValue; // Revert to original value if left blank
                }
                if (newValue !== currentValue) {
                    let supplierId = $this.closest('tr').find('.editable.supplier').data('supplier-id');
                    if (!supplierId && newValue > 0) {
                        showNotification('You must select a supplier if you add a quantity.', 'error');
                        $this.text(currentValue); // Revert back to original value
                        return;
                    }
                    $.ajax({
                        url: `/api/admin/stocks/${id}`,
                        type: 'PUT',
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        data: {
                            quantity: newValue,
                            supplier_id: supplierId
                        },
                        success: function(response) {
                            $this.text(newValue);
                            showNotification('Quantity updated successfully!', 'success');
                            console.log('Quantity updated:', response);
                        },
                        error: function(xhr, status, error) {
                            showNotification('Failed to update quantity. Please try again.', 'error');
                            console.error('AJAX Error:', status, error);
                            console.error('Response Text:', xhr.responseText);
                            $this.text(currentValue); // Revert back to original value on error
                        }
                    });
                } else {
                    $this.text(currentValue); // Revert back to original value if unchanged
                }
            }
        });
    });

    // Edit supplier on double-click
    $(document).on('dblclick', '.editable.supplier', async function() {
        let $this = $(this);
        let currentSupplierId = $this.data('supplier-id');
        let id = $this.data('id');
        let supplierOptions = await loadSuppliers();
        $this.html(`<select class="form-control select2">${supplierOptions}</select>`);
        $this.find('select').val(currentSupplierId).select2().focus().on('select2:close blur', function() {
            let newSupplierId = $(this).val();
            if (newSupplierId !== currentSupplierId) {
                let quantity = $this.closest('tr').find('.editable.quantity').text().trim();
                if (!newSupplierId && quantity > 0) {
                    showNotification('You must select a supplier if you have a quantity greater than zero.', 'error');
                    $this.html($this.find('option[value="' + currentSupplierId + '"]').text()); // Revert back to original value
                    return;
                }
                if (isSupplierProductExist($this.closest('tr').find('.editable.product').data('id'), newSupplierId)) {
                    showNotification('The same supplier cannot be assigned to the same product.', 'error');
                    $this.html($this.find('option[value="' + currentSupplierId + '"]').text()); // Revert back to original value
                    return;
                }
                $.ajax({
                    url: `/api/admin/stocks/${id}`,
                    type: 'PUT',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: {
                        quantity: quantity,
                        supplier_id: newSupplierId
                    },
                    success: function(response) {
                        $this.data('supplier-id', newSupplierId);
                        $this.text($this.find('option:selected').text());
                        showNotification('Supplier updated successfully!', 'success');
                        console.log('Supplier updated:', response);
                    },
                    error: function(xhr, status, error) {
                        showNotification('Failed to update supplier. Please try again.', 'error');
                        console.error('AJAX Error:', status, error);
                        console.error('Response Text:', xhr.responseText);
                        $this.text($this.find('option[value="' + currentSupplierId + '"]').text()); // Revert back to original value on error
                    }
                });
            } else {
                $this.text($this.find('option[value="' + currentSupplierId + '"]').text()); // Revert back to original value if unchanged
            }
        });
    });

    // Delete Button Click
    $(document).on('click', '.delete-stock', function() {
        var id = $(this).data('id');
        console.log('Delete button clicked for stock ID:', id);
        $('#confirm_message').text('Are you sure you want to delete this stock entry?');
        $('#confirm_button').text('Delete');
        $('#confirmModal').modal('show');
    
        $('#confirm_button').off('click').on('click', function() {
            console.log('Deleting stock with ID:', id);
            $.ajax({
                url: `/api/admin/stocks/${id}`,
                type: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    $('#confirmModal').modal('hide');
                    showNotification('Stock has been successfully deleted!', 'success');
                    $('#stock_table').DataTable().ajax.reload();  // Reload the table data
                    console.log('Delete response:', response);
                },
                error: function(xhr, status, error) {
                    showNotification('Failed to delete stock. Please try again.', 'error');
                    console.error('AJAX Error:', status, error);
                    console.error('Response Text:', xhr.responseText);
                }
            });
        });
    });

    // Export to Excel
    $('#export_excel').on('click', function() {
        console.log('Export to Excel button clicked');
        var data = $('#stock_table').DataTable().rows({ search: 'applied' }).data().toArray();
        var formattedData = data.map(function(stock) {
            return {
                Product: stock.product_name || 'N/A',
                Quantity: stock.quantity || '0',
                Supplier: stock.supplier_name || 'N/A'
            };
        });
        var ws = XLSX.utils.json_to_sheet(formattedData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Stocks");
        XLSX.writeFile(wb, "stocks.xlsx");
    });

    // Check if supplier-product combination already exists
    function isSupplierProductExist(productId, supplierId) {
        let isExist = false;
        $('#stock_table').DataTable().rows().every(function(rowIdx, tableLoop, rowLoop) {
            let data = this.data();
            if (data.product_id == productId && data.supplier_id == supplierId) {
                isExist = true;
                return false; // Break the loop
            }
        });
        return isExist;
    }

    // Utility function to show notification
    function showNotification(message, type) {
        var alertDiv = type === 'success' ? $('#success_alert') : $('#error_alert');
        var messageSpan = type === 'success' ? $('#success_message') : $('#error_message');
        messageSpan.text(message);
        alertDiv.fadeIn();

        setTimeout(function() {
            alertDiv.fadeOut();
        }, 4000);
    }

    // Listen for product creation event
    $(document).on('productCreated', function() {
        console.log('Product created event received');
        $('#stock_table').DataTable().ajax.reload();
    });

    // Check for newly created product using localStorage
    if (localStorage.getItem('productCreated') === 'true') {
        console.log('New product detected, reloading stock table');
        $('#stock_table').DataTable().ajax.reload();
        localStorage.removeItem('productCreated');
    }
});
