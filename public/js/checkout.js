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

    // Checkout functionality
    $('#checkout').click(function(e) {
        e.preventDefault();

        const csrfToken = $('meta[name="csrf-token"]').attr('content');

        let items = [];
        $("#cart-items tr").each(function() {
            let itemid = parseInt($(this).find(".itemId").html()); 
            let qty = parseInt($(this).find(".quantity-input").val()); 
            items.push({
                "item_id": itemid,
                "quantity": qty
            });
        });

        let courierId = $('#courier').val();
        let paymentMethod = $('#payment-method').val();

        // Debugging: Check the value of paymentMethod
        console.log('Selected Payment Method:', paymentMethod);

        $.ajax({
            type: "POST",
            url: "/api/checkout",
            headers: {
                'X-CSRF-TOKEN': csrfToken 
            },
            data: JSON.stringify({
                items: items,
                courier_id: courierId,
                payment_method: paymentMethod
            }),
            contentType: "application/json",
            success: function(response) {
                if (response.code === 200) {
                    showCustomNotification('Successfully ordered!', 'success', 'View Order', function() {
                        window.location.href = '/customer/dashboard';
                    });
                    fetchCartCount(); // Update cart count after checkout
                    calculateTotal(); // Update total amount after checkout
                } else {
                    showCustomNotification(response.error, 'error');
                }
            },
            error: function (xhr, status, error) {
                console.error('Error status:', status);
                console.error('Error details:', error);
                showCustomNotification('Error processing checkout. Please try again.', 'error');
            }
        });
    });

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