
@extends('layouts.shop')

@section('body')
    <div class="cart-container">
        <h2 class="cart-title">Your Cart</h2>
        <table class="table" id="cart-table">
            <tbody id="cart-items">
                @foreach ($mycarts as $cart)
                    @php
                        $imageUrl = !empty($cart->image)
                            ? asset("storage/product_images/{$cart->image}")
                            : asset('storage/product_images/default-placeholder.png');
                    @endphp
                    <tr data-id="{{ $cart->id }}">
                        <td class="product-info">
                            <img src="{{ $imageUrl }}" alt="{{ $cart->name }}" class="product-image">
                            <div class="product-details">
                                <h5>{{ $cart->name }}</h5>
                                <p>Category: {{ $cart->category }}</p>
                            </div>
                        </td>
                        <td class="product-price">
                            ₱<span class="price">{{ $cart->price }}</span>
                        </td>
                        <td class="#cart-count">
                            <div class="quantity-container">
                                <button class="quantity-minus btn-quantity" data-id="{{ $cart->id }}" {{ $cart->pivot_quantity <= 1 ? 'disabled' : '' }}>-</button>
                                <input type="text" id="quantity-{{ $cart->id }}" class="quantity quantity-input" value="{{ $cart->pivot_quantity ?? 1 }}" readonly>
                                <button class="quantity-plus btn-quantity" data-id="{{ $cart->id }}">+</button>
                            </div>
                        </td>
                        <td class="product-remove">
                            <button class="btn-remove" data-id="{{ $cart->id }}">x</button>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="unique-checkout-container">
        <div class="total-amount">Total: ₱<span id="total-amount">0.00</span></div>
        <a href="{{ route('checkoutDetails') }}" class="btn btn-primary" id="checkout-button">Proceed to Checkout</a>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('js/cart.js') }}" defer></script>
    <script>
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
    </script>
@endpush