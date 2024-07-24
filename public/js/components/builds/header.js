window.renderHeader = function(user, hideComponents, role, myCartUrl) {
    const hideSearchBar = window.location.pathname === '/customer/profile';
    let query = ''; 
    let dropdownVisible = false;
    let cartHovered = false;
    const cartItems = [
        { id: 1, name: 'Product 1', price: '₱1,799', image: 'https://via.placeholder.com/40' },
        { id: 2, name: 'Product 2', price: '₱1,749', image: 'https://via.placeholder.com/40' },
        { id: 3, name: 'Product 3', price: '₱1,249', image: 'https://via.placeholder.com/40' },
        { id: 4, name: 'Product 4', price: '₱1,499', image: 'https://via.placeholder.com/40' },
        { id: 5, name: 'Product 5', price: '₱1,099', image: 'https://via.placeholder.com/40' },
    ];
    let isLoggingOut = false;

    const toggleDropdown = () => {
        dropdownVisible = !dropdownVisible;
        $('.profile-dropdown').toggleClass('visible', dropdownVisible);
    };

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

    const handleSearchChange = (e) => {
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
                                <input type="text" placeholder="Search..." class="search-input" value="${query}" />
                                <i class="search-icon fas fa-search"></i>
                            </div>
                        </div>
                    ` : ''}
                    <div class="header-right">
                        ${role === 'customer' ? `
                            <div class="cart-icon-container">
                                <li class="nav-link">
                                    <a href="${myCartUrl}" class="nav-link-item">
                                        <i class='bx bx-cart icon'></i>
                                        <span class="text nav-text">Cart</span>
                                    </a>
                                </li>
                                <div class="cart-popup">
                                    <div class="cart-popup-content">
                                        <div class="cart-popup-header">Recently Added Products</div>
                                        ${cartItems.length === 0 ? `
                                            <img src="/path/to/no-products-icon.png" alt="No Products" class="no-products-icon" />
                                            <p>No Products Yet</p>
                                        ` : `
                                            <ul>
                                                ${cartItems.slice(0, 5).map(product => `
                                                    <li key="${product.id}" class="cart-item">
                                                        <img src="${product.image}" alt="${product.name}" class="cart-item-image" />
                                                        <div class="cart-item-details">
                                                            <span class="cart-item-name">${product.name}</span>
                                                            <span class="cart-item-price">${product.price}</span>
                                                        </div>
                                                    </li>
                                                `).join('')}
                                            </ul>
                                            <button class="view-cart-button" onclick="navigate('/customer/cart')">View My Shopping Cart</button>
                                        `}
                                    </div>
                                </div>
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

    // Event listeners
    $(document).on('change', '.search-input', handleSearchChange);
    $(document).on('mouseenter', '.cart-icon-container', () => {
        cartHovered = true;
        $('.cart-popup').show();
    });
    $(document).on('mouseleave', '.cart-icon-container', () => {
        cartHovered = false;
        $('.cart-popup').hide();
    });
};

function navigate(path) {
    window.location.href = path;
}

function toggleDropdown() {
    const dropdownVisible = !$('.profile-dropdown').hasClass('visible');
    $('.profile-dropdown').toggleClass('visible', dropdownVisible);
}
