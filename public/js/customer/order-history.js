$(document).ready(function() {
    fetchOrders();

    function fetchOrders() {
        $.ajax({
            url: "/api/customer/orders/history",
            type: "GET",
            success: function(response) {
                if (response.orders) {
                    renderOrders(response.orders);
                }
            },
            error: function(xhr) {
                console.error("Error fetching orders:", xhr.responseText);
            }
        });
    }

    function renderOrders(orders) {
        const statusTabs = ['all', 'pending', 'shipped', 'to_receive', 'completed', 'failed', 'canceled'];
        statusTabs.forEach(status => {
            const orderSection = $('#order-section-' + status + ' .orders');
            orderSection.empty(); // Clear previous content
            let ordersExist = false;
            orders.forEach(order => {
                if (status == 'all' || order.status == status) {
                    ordersExist = true;
                    orderSection.append(`
                        <div class="order-card" data-order-id="${order.id}">
                            <div class="product-image">
                                <img src="${order.products[0].image_url}" alt="${order.products[0].name}">
                            </div>
                            <div class="order-info">
                                <h4>Order #${order.id}</h4>
                                <div class="order-status-display">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
                                ${order.products.map(product => `
                                    <p>${product.name} - Quantity: ${product.pivot.quantity}</p>
                                `).join('')}
                                <p>Total Price: ₱${order.products.reduce((sum, product) => sum + product.price * product.pivot.quantity, 0).toFixed(2)}</p>
                                ${order.status === 'completed' ? '<button class="review-button">Review</button>' : ''}
                            </div>
                        </div>
                    `);
                }
            });
            if (!ordersExist) {
                orderSection.append(`<p class="no-orders">No orders found for this status.</p>`);
            }
        });
    }

    $('.tab').click(function() {
        $('.tab').removeClass('active');
        $(this).addClass('active');

        var status = $(this).data('status');
        $('.order-section').removeClass('active');
        $('#order-section-' + status).addClass('active');

        // Check if the target element exists before using offset().top
        var targetSection = $('#order-section-' + status);
        if (targetSection.length) {
            $('html, body').animate({
                scrollTop: targetSection.offset().top - 100
            }, 500);
        }
    });

    // Initially show the 'All' tab
    $('.tab[data-status="all"]').click();

    // Add hover effect to order cards
    $(document).on('mouseenter', '.order-card', function() {
        $(this).addClass('hover');
    }).on('mouseleave', '.order-card', function() {
        $(this).removeClass('hover');
    });

    // Review button click event
    $(document).on('click', '.review-button', function() {
        // Implement your review functionality here
        alert('Review functionality to be implemented');
    });
});