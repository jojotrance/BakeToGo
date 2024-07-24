// public/js/SidebarData.js
window.SidebarData = [
    {
        title: "Dashboard",
        icon: '<i class="fas fa-tachometer-alt"></i>',
        link: "/admin/dashboard"
    },
    {
        title: "Manage products",
        icon: '<i class="fas fa-box-open"></i>',
        link: "/admin/products"
    },
    {
        title: "Manage Orders",
        icon: '<i class="fas fa-clipboard-list"></i>',
        link: "/admin/orders"
    },
    {
        title: "Payment Methods",
        icon: '<i class="fa-solid fa-money-check"></i>',
        link: "/admin/payments"
    },
    {
        title: "Couriers",
        icon: '<i class="fas fa-truck"></i>',
        link: "/admin/courier"
    },
    {
        title: "Suppliers",
        icon: '<i class="fas fa-warehouse"></i>',
        link: "/admin/suppliers"
    },
    {
        title: "Users",
        icon: '<i class="fas fa-users"></i>',
        link: "/admin/users"
    },
    {
        title: "Stock",
        icon: '<i class="fas fa-boxes"></i>',
        link: "/admin/stock"
    },
    {
        title: "Charts",
        icon: '<i class="fas fa-chart-pie"></i>',
        link: "/admin/charts",
        submenu: [
            {
                title: "Chart 1",
                icon: '<i class="fas fa-chart-bar"></i>',
                link: "/admin/pages/charts/total-role"
            },
            {
                title: "Chart 3",
                icon: '<i class="fas fa-chart-line"></i>',
                link: "/admin/pages/charts/courier-per-branch"
            },
            {
                title: "Chart 4",
                icon: '<i class="fas fa-chart-line"></i>',
                link: "/admin/pages/charts/total-supplier"
            }
        ]
    }
];
