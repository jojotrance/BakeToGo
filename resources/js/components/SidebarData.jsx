import React from 'react';
import ProductionQuantityLimitsRoundedIcon from '@mui/icons-material/ProductionQuantityLimitsRounded';
import ViewQuiltSharpIcon from '@mui/icons-material/ViewQuiltSharp';
import Inventory2SharpIcon from '@mui/icons-material/Inventory2Sharp';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DeliveryDiningRoundedIcon from '@mui/icons-material/DeliveryDiningRounded';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import LineStyleIcon from '@mui/icons-material/LineStyle';

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <DashboardRoundedIcon />,
        link: "/admin/dashboard"
    },
    {
        title: "Manage products",
        icon: <ProductionQuantityLimitsRoundedIcon />,
        link: "/admin/products"
    },
    {
        title: "Manage Orders",
        icon: <ViewQuiltSharpIcon />,
        link: "/admin/orders"
    },

    {
        title: "Couriers",
        icon: <DeliveryDiningRoundedIcon   />,
        link: "/admin/courier"

    },

    {
        title: "Suppliers",
        icon: <AccountTreeIcon />,
        link: "/admin/suppliers"
    },

    {
        title: "Users",
        icon: <GroupIcon />,
        link: "/admin/users"
    },
    {
        title: "Stock",
        icon: <Inventory2SharpIcon />,
        link: "/admin/stock"
    },
    {
        title: "Charts",
        icon: <Inventory2SharpIcon />,
        link: "/admin/charts",
        submenu: [
            {
                title: "Chart 1",
                icon: <BarChartIcon />,
                link: "/admin/pages/charts/total-role"
            },
            {
                title: "Chart 3",
                icon: <LineStyleIcon />,
                link: "/admin/pages/charts/courier-per-branch"
            },
            {
                title: "Chart 4",
                icon: <LineStyleIcon />,
                link: "/admin/pages/charts/total-supplier"
            }
        ]
    }
];
