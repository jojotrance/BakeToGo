$(document).ready(function () {
    let currentPage = 1;
    let lastPage = 1;
    let loading = false;

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

    function loadProducts(page) {
        if (loading) return;
        loading = true;

        $.ajax({
            type: "GET",
            url: `/api/shop?page=${page}`,
            dataType: 'json',
            success: function (data) {
                lastPage = data.last_page;

                $.each(data.data, function (key, value) {
                    var imageUrl = value.image_url ? value.image_url : '/storage/product_images/default-placeholder.png';
                    var stock = value.total_stock !== undefined ? value.total_stock : 'Unavailable';

                    var item = `
                        <div class='menu-item'>
                            <div class='item-image'>
                                <img src='${imageUrl}' alt='${value.name}' />
                            </div>
                            <div class='item-details'>
                                <h5 class='item-name'>${value.name}</h5>
                                <p>Category: ${value.category}</p>
                                <p class='item-price'>Price: Php <span class='price'>${value.price}</span></p>
                                <p class='item-description'>${value.description}</p>
                                <p class='item-stock'>Stock: ${stock}</p>
                                <div class='quantity-container'>
                                    <button class='quantity-minus' disabled>-</button>
                                    <input type='text' class='quantity' value='0' readonly>
                                    <button class='quantity-plus'>+</button>
                                </div>
                                <p class='itemId' hidden>${value.id}</p>
                            </div>
                            <button type='button' class='btn btn-buy-now add'>Add to cart</button>
                        </div>`;
                    $("#items").append(item);
                });
                
                loading = false;
            },
            error: function () {
                console.log('AJAX load did not work');
                showCustomNotification("Error loading data.", "error");
                loading = false;
            }
        });
    }

    function initPagination() {
        $(window).scroll(function () {
            if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
                if (currentPage < lastPage) {
                    currentPage++;
                    loadProducts(currentPage);
                }
            }
        });
    }

    // Initial load
    loadProducts(currentPage);
    initPagination();

    // Add to cart functionality
    $("#items").on('click', '.add', function () {
        var item = $(this).closest('.menu-item');
        var productId = item.find('.itemId').text();
        var quantity = parseInt(item.find('.quantity').val());

        if (quantity === 0) {
            showCustomNotification('Please add quantity first', 'error');
            return;
        }

        $.ajax({
            type: "POST",
            url: "/api/addtoCart",
            data: JSON.stringify({
                product_id: productId,
                quantity: quantity
            }),
            contentType: "application/json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                // Reset quantity counter
                item.find('.quantity').val('0');
                item.find('.quantity-minus').prop('disabled', true).css('color', '#ccc');
                
                showCustomNotification('Item added to cart successfully!', 'success', 'View Cart', function() {
                    // Add logic to view cart here
                });

                fetchCartCount(); // Update cart count
                calculateTotal(); // Update total amount
            },
            error: function (xhr, status, error) {
                console.error("Error adding item to cart:", status, error);
                showCustomNotification('Error adding item to cart.', 'error');
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
