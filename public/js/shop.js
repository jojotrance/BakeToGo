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

    // Function to fetch cart count
    function fetchCartCount() {
        $.ajax({
            type: "GET",
            url: "/api/cart/count",
            success: function (data) {
                $('#cart-count').text(data.count);
            },
            error: function () {
                console.error('Failed to fetch cart count');
            }
        });
    }

    function loadProducts(page) {
        if (loading) return;
        loading = true;

        $.ajax({
            type: "GET",
            url: `/api/shop?page=${page}`,
            dataType: 'json',
            success: function (data) {
                console.log(data); // Debug: Log the data received from the API
                lastPage = data.last_page;

                $.each(data.data, function (key, value) { // Change from data to data.data
                    console.log(value); // Debug: Log each product's data
                    var imageUrl = value.image_url ? value.image_url : '/storage/product_images/default-placeholder.png';
                    var stock = value.total_stock !== undefined ? value.total_stock : 'Unavailable';
                    console.log('Stock:', stock); // Debug: Log the stock value

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
            },
            error: function (xhr, status, error) {
                console.error("Error adding item to cart:", status, error);
                showCustomNotification('Error adding item to cart.', 'error');
            }
        });
    });

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
            }
        });
    }

    handleQuantityChange('#items');
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

    // Checkout functionality
    $('#checkout').click(function(e) {
        e.preventDefault();

        const csrfToken = $('meta[name="csrf-token"]').attr('content');

        let items = [];
        $(".menu-item").each(function() {
            let itemid = parseInt($(this).find(".itemId").html()); 
            let qty = parseInt($(this).find(".quantity").val()); 
            items.push({
                "item_id": itemid,
                "quantity": qty
            });
        });

        let courierId = $('#courier').val();
        let paymentMethod = $('#paymentMethod').val();

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

    // Initial cart count fetch
    fetchCartCount();
});
