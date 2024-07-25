import $ from 'jquery';
import './components/builds/header';

$(document).ready(function () {
    const appRoot = $('#app-root');
    let user = null;
    let hideComponents = false;
    let isExpanded = true;
    let openSubmenu = null;
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
        $('#customer-cart').html('<h2>Shopping Cart</h2><p>Your cart items will appear here.</p>');
    };

    const renderCustomerDashboard = () => {
        $('#customer-dashboard').html('<h2>Dashboard</h2><p>Welcome to your dashboard.</p>');   
    };

    const renderCustomerProfile = () => {
        $('#customer-profile').html('<h2>Profile Page</h2><p>This is your profile page.</p>');
    };

    const renderCustomerPurchase = () => {
        $('#customer-purchase').html('<h2>Purchase History</h2><p>Your purchase history will appear here.</p>');
    };

    const renderCustomerMyReviews = () => {
        $('#customer-myreviews').html('<h2>My Reviews</h2><p>Your reviews will appear here.</p>');
    };

    fetchUserProfile();

    // Add to cart functionality
    $('#hits').on('click', '.add', function () {
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

    handleQuantityChange('#hits');
    handleQuantityChange('#cart-items');

    function updateQuantityBackend(input, change) {
        var productId = input.attr('id').split('-')[1];
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
