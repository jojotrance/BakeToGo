import $ from 'jquery';

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

    // Function to handle quantity change
    function handleQuantityChange() {
        $('#cart-items').on('click', '.quantity-plus', function () {
            const input = $(this).siblings('.quantity-input');
            const newQuantity = parseInt(input.val()) + 1;
            const productId = $(this).data('id');
            input.val(newQuantity);
            updateQuantity(productId, newQuantity);
        });

        $('#cart-items').on('click', '.quantity-minus', function () {
            const input = $(this).siblings('.quantity-input');
            const newQuantity = parseInt(input.val()) - 1;
            if (newQuantity >= 1) {
                const productId = $(this).data('id');
                input.val(newQuantity);
                updateQuantity(productId, newQuantity);
            }
        });
    }

    // Function to update quantity
    function updateQuantity(productId, quantity) {
        $.ajax({
            type: "PUT",
            url: `/api/updateCart/${productId}`,
            data: JSON.stringify({ quantity: quantity }),
            contentType: "application/json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function () {
                showCustomNotification('Quantity updated successfully.');
                calculateTotal();
            },
            error: function () {
                console.error('Failed to update quantity');
            }
        });
    }

    // Function to remove item from cart
    function removeItem(productId) {
        console.log(`Attempting to remove item with ID: ${productId}`);
        $.ajax({
            type: "DELETE",
            url: `/api/removeFromCart/${productId}`,
            contentType: "application/json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                console.log('Remove item response:', response);
                showCustomNotification('Item removed successfully.');
                $(`tr[data-id="${productId}"]`).remove();
                calculateTotal();
                fetchCartCount();
            },
            error: function (xhr, status, error) {
                console.error('Failed to remove item:', error);
                console.error('Response:', xhr.responseText);
            }
        });
    }

    // Calculate total amount function
    function calculateTotal() {
        let total = 0;
        $('#cart-items tr').each(function () {
            const price = parseFloat($(this).find('.price').text());
            const quantity = parseInt($(this).find('.quantity-input').val());
            total += price * quantity;
        });
        $('#total-amount').text(total.toFixed(2));
    }

    // Set default quantity to 1 if not already set
    $('#cart-items .quantity-input').each(function() {
        if (!$(this).val()) {
            $(this).val(1);
        }
    });

    // Initial cart count fetch
    fetchCartCount();

    // Event listeners
    handleQuantityChange();
    $('#cart-items').on('click', '.btn-remove', function () {
        const productId = $(this).data('id');
        removeItem(productId);
    });

    // Calculate total amount on initial load
    calculateTotal();
});
