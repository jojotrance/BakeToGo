$(document).ready(function () {
    // Load products
    $.ajax({
        type: "GET",
        url: "/api/shop",
        dataType: 'json',
        success: function (data) {
            console.log(data); // Debug: Log the data received from the API
            $.each(data, function (key, value) {
                console.log(value); // Debug: Log each product's data
                var imageUrl = value.image ? `/storage/product_images/${value.image}` : '/storage/product_images/default-placeholder.png';
                var stock = value.stock !== undefined ? value.stock : 'Unavailable';
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
                            <p>Stock: ${stock}</p>
                            <div class='quantity-container'>
                                <button class='quantity-minus'>-</button>
                                <input type='text' class='quantity' value='0' readonly>
                                <button class='quantity-plus'>+</button>
                            </div>
                            <p class='itemId' hidden>${value.id}</p>
                        </div>
                        <button type='button' class='btn btn-buy-now add'>Add to cart</button>
                    </div>`;
                $("#items").append(item);
            });
        },
        error: function () {
            console.log('AJAX load did not work');
            alert("Error loading data.");
        }
    });

    // Add to cart functionality
    $("#items").on('click', '.add', function () {
        var item = $(this).closest('.menu-item');
        var productId = item.find('.itemId').text();
        var quantity = parseInt(item.find('.quantity').val());

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
                alert('Item added to cart successfully!');
            },
            error: function (xhr, status, error) {
                console.error("Error adding item to cart:", status, error);
                alert('Error adding item to cart.');
            }
        });
    });

    // Quantity change handlers
    function handleQuantityChange(selector) {
        $(selector).on('click', '.quantity-plus', function () {
            var input = $(this).siblings('.quantity');
            var max = input.attr('max') || 999;
            var currentVal = parseInt(input.val()) || 0;
            if (currentVal < max) {
                input.val(currentVal + 1);
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
                if (selector === '#cart-items') {
                    updateQuantityBackend(input, -1);
                }
            }
        });
    }

    handleQuantityChange('#items');
    handleQuantityChange('#cart-items');

    function updateQuantityBackend(input, change) {
        var productId = input.attr('id').split('-')[1];
        var newQuantity = parseInt(input.val());

        $.ajax({
            type: "POST",
            url: "/api/addtoCart", // Using the same route
            data: JSON.stringify({
                product_id: productId, // Adjust according to your logic
                quantity: newQuantity
            }),
            contentType: "application/json",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                console.log('Quantity updated successfully');
            },
            error: function (xhr, status, error) {
                console.error("Error updating quantity:", status, error);
                alert('Error updating quantity.');
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
            },
            error: function (xhr, status, error) {
                console.error("Error removing item:", status, error);
                alert('Error removing item.');
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
                    window.location.href = '/customer/dashboard';
                    alert('Successfully ordered!');
                } else {
                    alert(response.error); 
                }
            },
            error: function (xhr, status, error) {
                console.error('Error status:', status);
                console.error('Error details:', error);
                alert('Error processing checkout. Status: ' + status + '. Error: ' + error);
            }
        });
    });
});
