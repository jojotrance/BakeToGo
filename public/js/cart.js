$(document).ready(function () {
    // Custom Notification Function
    function showCustomNotification(message, type = 'success', buttonText = null, buttonCallback = null) {
        const notificationsContainer = document.getElementById('custom-notifications');
        
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        
        const logo = document.createElement('img');
        logo.className = 'notification-logo';
        logo.src = 'customer/images/bake-logo.jpg'; // Replace with the actual path to your logo
        logo.alt = 'Logo';
        
        const content = document.createElement('div');
        content.className = 'notification-content';
        
        const messageElement = document.createElement('p');
        messageElement.className = 'notification-message';
        messageElement.textContent = message;
        
        content.appendChild(messageElement);
        
        if (buttonText && buttonCallback) {
            const button = document.createElement('button');
            button.className = 'notification-button';
            button.textContent = buttonText;
            button.onclick = buttonCallback;
            content.appendChild(button);
        }
        
        const closeButton = document.createElement('button');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => notification.remove();
        
        notification.appendChild(logo);
        notification.appendChild(content);
        notification.appendChild(closeButton);
        
        notificationsContainer.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => notification.remove(), 5000);
    }

    // Function to fetch cart count and total amount
    function fetchCartCount() {
        $.ajax({
            type: "GET",
            url: "/api/cart/count",
            success: function (data) {
                $('#cart-count').text(data.count);
                calculateTotal();
            },
            error: function () {
                console.error('Failed to fetch cart count');
            }
        });
    }

    // Quantity change handlers
    function handleQuantityChange(selector) {
        $(selector).on('click', '.quantity-plus', function () {
            var input = $(this).siblings('.quantity');
            var minusButton = $(this).siblings('.quantity-minus');
            var max = input.attr('max') || 999;
            var currentVal = parseInt(input.val()) || 0;
            if (currentVal < max) {
                input.val(currentVal + 1);
                minusButton.prop('disabled', false).css('color', '#000');
                if (selector === '#cart-items') {
                    updateQuantityBackend(input, 1);
                }
                calculateTotal();
            }
        });

        $(selector).on('click', '.quantity-minus', function () {
            var input = $(this).siblings('.quantity');
            var min = input.attr('min') || 0;
            var currentVal = parseInt(input.val()) || 0;
            if (currentVal > min) {
                input.val(currentVal - 1);
                if (currentVal - 1 === 0) {
                    $(this).prop('disabled', true).css('color', '#ccc');
                }
                if (selector === '#cart-items') {
                    updateQuantityBackend(input, -1);
                }
                calculateTotal();
            }
        });
    }

    handleQuantityChange('#cart-items');

    function updateQuantityBackend(input, change) {
        var productId = input.closest('.menu-item').find('.itemId').text();
        var newQuantity = parseInt(input.val());

        $.ajax({
            type: "POST",
            url: "/api/addtoCart",
            data: JSON.stringify({
                product_id: productId,
                quantity: newQuantity
            }),
            contentType: "application/json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                console.log('Quantity updated successfully');
                showCustomNotification('Quantity updated successfully', 'success');
                fetchCartCount(); // Update cart count
                calculateTotal(); // Update total amount
            },
            error: function (xhr, status, error) {
                console.error("Error updating quantity:", status, error);
                showCustomNotification('Error updating quantity. Please try again.', 'error');
            }
        });
    }

    function removeItem(productId) {
        $.ajax({
            type: "POST",
            url: "/api/removeFromCart",
            data: JSON.stringify({
                product_id: productId
            }),
            contentType: "application/json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                $('tr[data-id="' + productId + '"]').remove();
                console.log('Item removed successfully');
                showCustomNotification('Item removed from cart successfully', 'success');
                fetchCartCount(); // Update cart count
                calculateTotal(); // Update total amount
            },
            error: function (xhr, status, error) {
                console.error("Error removing item:", status, error);
                showCustomNotification('Error removing item. Please try again.', 'error');
            }
        });
    }

    $('#cart-items').on('click', '.btn-remove', function () {
        var productId = $(this).data('id');
        removeItem(productId);
    });

    // Initial cart count fetch
    fetchCartCount();

    // Calculate total amount function
    function calculateTotal() {
        let total = 0;
        $('#cart-items tr').each(function () {
            const price = parseFloat($(this).find('.price').text());
            const quantity = parseInt($(this).find('.quantity').val());
            total += price * quantity;
        });
        $('#total-amount').text(total.toFixed(2));
    }
});
