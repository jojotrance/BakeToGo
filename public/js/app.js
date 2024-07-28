import $ from 'jquery';
import './components/builds/header'; // Ensure header.js is loaded

$(document).ready(function () {
    const appRoot = $('#app-root');
    let user = null;
    let hideComponents = false;
    const myCartUrl = appRoot.data('cart-url');

    const fetchUserProfile = async () => {
        try {
            const response = await $.get('/api/user-profile');
            user = response;
            initializeApp();
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const initializeApp = () => {
        if (appRoot.length) {
            hideComponents = appRoot.data('hide-components') === 'true';
            const role = user.role === 'admin' ? 'admin' : 'customer';

            if (typeof window.renderHeader === 'function') {
                window.renderHeader(user, hideComponents, role, myCartUrl);
            } else {
                console.error('renderHeader function is not defined.');
            }

            if (!user) {
                $('#content').html('<div>Loading...</div>');
                return;
            }

            renderContent(role);
        } else {
            console.error('Element with id "app-root" not found.');
        }
    };

    const renderContent = (role) => {
        const content = $('#content');
        if (!hideComponents) {
            if (role === 'admin') {
                content.append('<div class="Sidebar"></div>');
                renderAdminSidebar();
            } else if (role === 'customer') {
                content.append('<div id="customer-sidebar"></div>');
                renderCustomerSidebar();
            }
        }

        if (role === 'customer') {
            renderCustomerRoutes();
        }
    };

    const renderAdminSidebar = () => {
        $.getScript("/js/admin/admin-sidebar.js");
    };

    const renderCustomerSidebar = () => {
        console.log('Rendering customer sidebar');
    };

    const renderCustomerRoutes = () => {
        const routes = `
            <div class="content">
                <div id="customer-cart"></div>
                <div id="customer-dashboard"></div>
                <div id="customer-profile"></div>
                <div id="customer-purchase"></div>
                <div id="customer-myreviews"></div>
            </div>
        `;
        $('#content').html(routes);
        loadCustomerComponents();
    };

    const loadCustomerComponents = () => {
        const path = window.location.pathname;
        if (path === '/customer/cart') {
            renderCustomerCart();
        } else if (path === '/customer/dashboard') {
            renderCustomerDashboard();
        } else if (path === '/customer/profile') {
            renderCustomerProfile();
        } else if (path === '/customer/purchase') {
            renderCustomerPurchase();
        } else if (path === '/customer/myreviews') {
            renderCustomerMyReviews();
        }
    };

    const renderCustomerCart = () => {
        $.get('/api/cart', function(data) {
            let cartItemsHtml = '';
            data.forEach(cart => {
                cartItemsHtml += `
                    <tr data-id="${cart.id}">
                        <td class="product-info">
                            <img src="${cart.image ? '/storage/product_images/' + cart.image : '/storage/product_images/default-placeholder.png'}" alt="${cart.name}" class="product-image">
                            <div class="product-details">
                                <h5>${cart.name}</h5>
                                <p>Category: ${cart.category}</p>
                            </div>
                        </td>
                        <td class="product-price">
                            ₱<span class="price">${cart.price}</span>
                        </td>
                        <td class="product-quantity">
                            <div class="quantity-container">
                                <button class="quantity-minus btn-quantity" data-id="${cart.id}">-</button>
                                <input type="text" id="quantity-${cart.id}" class="quantity quantity-input" value="${cart.pivot_quantity ?? 1}" readonly>
                                <button class="quantity-plus btn-quantity" data-id="${cart.id}">+</button>
                            </div>
                        </td>
                        <td class="product-remove">
                            <button class="btn-remove" data-id="${cart.id}">✖</button>
                        </td>
                    </tr>
                `;
            });
            $('#cart-items').html(cartItemsHtml);
            calculateTotal();
        });
    };

    const renderCustomerDashboard = () => {
        $('#customer-dashboard').html('<h2>Dashboard</h2><p>Welcome to your dashboard.</p>');   
    };

    const renderCustomerProfile = () => {
        $.get('/profile', function(data) {
            $('#customer-profile').html(data);
            setupProfileForm();
        });
    };

    const renderCustomerPurchase = () => {
        $('#customer-purchase').html('<h2>Purchase History</h2><p>Your purchase history will appear here.</p>');
    };

    const renderCustomerMyReviews = () => {
        $('#customer-myreviews').html('<h2>My Reviews</h2><p>Your reviews will appear here.</p>');
    };

    const setupProfileForm = () => {
        const form = $('#profile-form');
        const errorMessages = $('#error-messages');
        const profilePicInput = $('#profile_image');
        const profilePic = $('#profile-pic');

        form.on('submit', function(e) {
            e.preventDefault();
            errorMessages.empty();

            const formData = new FormData(this);
            let valid = true;

            // Validation
            if (!$('#fname').val().trim()) {
                valid = false;
                errorMessages.append('<p>First name is required.</p>');
            }

            if (!$('#lname').val().trim()) {
                valid = false;
                errorMessages.append('<p>Last name is required.</p>');
            }

            if (!$('#email').val().trim()) {
                valid = false;
                errorMessages.append('<p>Email is required.</p>');
            }

            if (!$('#contact').val().trim()) {
                valid = false;
                errorMessages.append('<p>Contact is required.</p>');
            }

            if (!$('#address').val().trim()) {
                valid = false;
                errorMessages.append('<p>Address is required.</p>');
            }

            if (valid) {
                $.ajax({
                    url: form.attr('action'),
                    method: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        alert('Profile updated successfully');
                        window.location.reload();
                    },
                    error: function(xhr) {
                        const errors = xhr.responseJSON.errors;
                        for (let key in errors) {
                            if (errors.hasOwnProperty(key)) {
                                errorMessages.append('<p>' + errors[key][0] + '</p>');
                            }
                        }
                    }
                });
            }
        });

        profilePicInput.on('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePic.attr('src', e.target.result);
                }
                reader.readAsDataURL(file);
            }
        });
    };

    fetchUserProfile();

    // Function to calculate total
    function calculateTotal() {
        let total = 0;
        $('#cart-items tr').each(function () {
            const price = parseFloat($(this).find('.price').text());
            const quantity = parseInt($(this).find('.quantity-input').val());
            total += price * quantity;
        });
        $('#total-amount').text(total.toFixed(2));
    }

    // Add to cart functionality
    $('#hits').on('click', '.add', function () {
        const item = $(this).closest('.menu-item');
        const productId = item.find('.itemId').text();
        let quantity = parseInt(item.find('.quantity').val());

        if (isNaN(quantity) || quantity === 0) {
            quantity = 1; // Set default quantity to 1 if it's the first add to cart
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
                alert('Item added to cart successfully!');
                renderCustomerCart(); // Re-render cart to get updated contents
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
            const input = $(this).siblings('.quantity');
            const max = input.attr('max') || 999;
            const currentVal = parseInt(input.val()) || 0;
            if (currentVal < max) {
                input.val(currentVal + 1);
                if (selector === '#cart-items') {
                    updateQuantityBackend(input);
                }
                calculateTotal();
            }
        });

        $(selector).on('click', '.quantity-minus', function () {
            const input = $(this).siblings('.quantity');
            const min = input.attr('min') || 0;
            const currentVal = parseInt(input.val()) || 0;
            if (currentVal > min) {
                input.val(currentVal - 1);
                if (selector === '#cart-items') {
                    updateQuantityBackend(input);
                }
                calculateTotal();
            }
        });
    }

    handleQuantityChange('#hits');
    handleQuantityChange('#cart-items');

    function updateQuantityBackend(input) {
        const productId = input.attr('id').split('-')[1];
        const newQuantity = parseInt(input.val());

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
                calculateTotal();
            },
            error: function (xhr, status, error) {
                console.error("Error removing item:", status, error);
                alert('Error removing item.');
            }
        });
    }

    $('#cart-items').on('click', '.btn-remove', function () {
        const productId = $(this).data('id');
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

    // Initial cart count fetch and initial total calculation
    fetchUserProfile();
    calculateTotal();
});
