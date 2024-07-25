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
        link: "#",
        submenu: [
            {
                title: "Total Role",
                icon: '<i class="fas fa-chart-bar"></i>',
                link: "/admin/charts/total-role"
            },
            {
                title: "Customer Per Address",
                icon: '<i class="fas fa-chart-line"></i>',
                link: "/admin/charts/customer-per-address"
            },
            {
                title: "Courier Per Branch",
                icon: '<i class="fas fa-chart-line"></i>',
                link: "/admin/charts/courier-per-branch"
            },
            {
                title: "Total Supplier",
                icon: '<i class="fas fa-chart-line"></i>',
                link: "/admin/charts/total-supplier"
            }
        ]
    }
];
