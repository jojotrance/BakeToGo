import $ from 'jquery';
import './components/builds/header'; // Ensure header.js is loaded

$(document).ready(function () {
    const appRoot = $('#app-root');
    let hideComponents = false;

    const initializeApp = (user) => {
        if (appRoot.length) {
            hideComponents = appRoot.data('hide-components') === 'true';
            const role = user.role === 'admin' ? 'admin' : 'customer';

            if (typeof window.renderHeader === 'function') {
                window.renderHeader(user, hideComponents, role, appRoot.data('cart-url'));
            } else {
                console.error('renderHeader function is not defined.');
            }

            renderContent(role);
        } else {
            console.error('Element with id "app-root" not found.');
        }
    };

    // Rendering Content Based on User Role
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
        $.get('/profile', function(data) {
            $('#customer-profile').html(data);
        });
    };

    const renderCustomerPurchase = () => {
        $('#customer-purchase').html('<h2>Purchase History</h2><p>Your purchase history will appear here.</p>');
    };

    const renderCustomerMyReviews = () => {
        $('#customer-myreviews').html('<h2>My Reviews</h2><p>Your reviews will appear here.</p>');
    };

    // Fetch user profile and initialize app
    const fetchUserProfile = async () => {
        try {
            const response = await $.get('/api/user-profile');
            initializeApp(response);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    fetchUserProfile();
});
