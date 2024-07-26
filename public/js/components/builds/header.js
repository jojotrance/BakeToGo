import $ from 'jquery';
import algoliasearch from 'algoliasearch/lite';

function toggleDropdown() {
    const dropdownVisible = !$('.profile-dropdown').hasClass('visible');
    $('.profile-dropdown').toggleClass('visible', dropdownVisible);
}

window.toggleDropdown = toggleDropdown;

function navigate(path) {
    window.location.href = path;
}

window.navigate = navigate;

window.renderHeader = function(user, hideComponents, role, myCartUrl) {
    const hideSearchBar = window.location.pathname === '/customer/profile';
    let query = ''; 
    let dropdownVisible = false;
    let cartHovered = false;
    const cartItems = [];
    let isLoggingOut = false;

    window.handleLogout = async () => {
        if (isLoggingOut) return;
        isLoggingOut = true;
        try {
            await $.post('/api/logout');
            setTimeout(() => {
                window.location.href = '/home';
            }, 100);
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Logout failed. Please try again.');
            isLoggingOut = false;
        }
    };

    const getWelcomeMessage = () => {
        let roleMessage = '';
        if (user.role === 'admin') {
            roleMessage = 'Admin';
        } else if (user.role === 'customer') {
            roleMessage = 'Customer';
        }
        return `Welcome ${roleMessage}, ${user.name}`;
    };

    window.handleSearchChange = (e) => {
        query = e.target.value;
        window.dispatchEvent(new CustomEvent('search-query', { detail: query }));
    };

    const getImageSrc = () => {
        if (!user || !user.profile_image) {
            return 'https://via.placeholder.com/40';
        }
        return `/storage/${user.profile_image}`;
    };

    const renderHeader = () => {
        $('#header').html(`
            <header class="header">
                <div class="header-content">
                    <div class="header-left">
                        ${role !== 'admin' ? `
                            <button class="logo-button" onclick="navigate('/customer/dashboard')">
                                <img src="../logos/baketogo.jpg" alt="Logo" class="logo" />
                            </button>
                        ` : ''}
                    </div>
                    ${role === 'customer' && !hideSearchBar ? `
                        <div class="search-bar">
                            <div class="search-input-container">
                                <input type="text" placeholder="Search for products" class="search-input" oninput="handleSearchChange(event)" />
                                <i class="search-icon fas fa-search"></i>
                            </div>
                        </div>
                    ` : ''}
                    <div class="header-right">
                        ${role === 'customer' ? `
                            <div class="cart-icon-container">
                                <li class="nav-link">
                                    <a href="${myCartUrl}" class="nav-link-item">
                                        <i class="fas fa-shopping-cart"></i>
                                    </a>
                                </li>
                            </div>
                        ` : ''}
                        <div class="profile-section" onclick="toggleDropdown()" role="button" tabindex="0" aria-haspopup="true" aria-expanded="${dropdownVisible}">
                            <img src="${getImageSrc()}" alt="Profile" class="profile-pic" />
                            <span class="welcome-message">${getWelcomeMessage()}</span>
                            <ul class="profile-dropdown ${dropdownVisible ? 'visible' : ''}">
                                ${role === 'customer' ? `
                                    <li>
                                        <i class="dropdown-icon fas fa-user"></i>
                                        <button onclick="navigate('/customer/profile'); toggleDropdown()">Manage Profile</button>
                                    </li>
                                    <li>
                                        <i class="dropdown-icon fas fa-history"></i>
                                        <button onclick="navigate('/customer/purchase'); toggleDropdown()">Purchase History</button>
                                    </li>
                                    <li>
                                        <i class="dropdown-icon fas fa-star"></i>
                                        <button onclick="navigate('/customer/myreviews'); toggleDropdown()">My Reviews</button>
                                    </li>
                                ` : ''}
                                <li>
                                    <i class="dropdown-icon fas fa-sign-out-alt"></i>
                                    <button onclick="handleLogout()" ${isLoggingOut ? 'disabled' : ''}>
                                        ${isLoggingOut ? 'Logging out...' : 'Logout'}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        `);
    };

    renderHeader();

    // Algolia search client
    const searchClient = algoliasearch('SKGEMY1IVJ', '90477025cfd3896f776e79b8d0625bca');

    // Load initial products (simplified)
    function loadProducts() {
        $.ajax({
            type: "GET",
            url: "/api/shop",
            dataType: 'json',
            success: function (data) {
                $('#items').empty(); // Clear previous items
                $.each(data, function (key, value) {
                    var imageUrl = value.image ? `/storage/product_images/${value.image}` : '/storage/product_images/default-placeholder.png';
                    var stock = value.stock !== undefined ? value.stock : 'Unavailable';

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

                // Add event listeners for the new items
                addEventListenersToItems();
            },
            error: function () {
                console.log('AJAX load did not work');
                alert("Error loading data.");
            }
        });
    }

    function addEventListenersToItems() {
        $('.add').click(function () {
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
    }

    // Listen for search-query event
    window.addEventListener('search-query', function (e) {
        const query = e.detail;
        if (query) {
            performSearch(query);
        } else {
            loadProducts(); // Load initial products if search query is empty
        }
    });

    function performSearch(query) {
        // Search with Algolia
        searchClient.initIndex('products').search(query).then(({ hits }) => {
            $('#items').empty(); // Clear previous items
            hits.forEach(hit => {
                var imageUrl = hit.image ? `/storage/product_images/${hit.image}` : '/storage/product_images/default-placeholder.png';
                var stock = hit.stock !== undefined ? hit.stock : 'Unavailable';

                var item = `
                    <div class='menu-item'>
                        <div class='item-image'>
                            <img src='${imageUrl}' alt='${hit.name}' />
                        </div>
                        <div class='item-details'>
                            <h5 class='item-name'>${hit.name}</h5>
                            <p>Category: ${hit.category}</p>
                            <p class='item-price'>Price: Php <span class='price'>${hit.price}</span></p>
                            <p class='item-description'>${hit.description}</p>
                            <p>Stock: ${stock}</p>
                            <div class='quantity-container'>
                                <button class='quantity-minus'>-</button>
                                <input type='text' class='quantity' value='0' readonly>
                                <button class='quantity-plus'>+</button>
                            </div>
                            <p class='itemId' hidden>${hit.id}</p>
                        </div>
                        <button type='button' class='btn btn-buy-now add'>Add to cart</button>
                    </div>`;
                $("#items").append(item);
            });

            // Add event listeners for the new items
            addEventListenersToItems();
        }).catch(err => {
            console.error(err);
        });
    }

    // Initial load of products
    loadProducts();
};
