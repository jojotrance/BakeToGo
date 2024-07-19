import React from 'react'
import ProductionQuantityLimitsRoundedIcon from '@mui/icons-material/ProductionQuantityLimitsRounded';
import ViewQuiltSharpIcon from '@mui/icons-material/ViewQuiltSharp';
import Inventory2SharpIcon from '@mui/icons-material/Inventory2Sharp';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DeliveryDiningRoundedIcon from '@mui/icons-material/DeliveryDiningRounded';
import GroupIcon from '@mui/icons-material/Group';

export const SidebarData = [

    {
        title: "Dashboard",
        icon: <DashboardRoundedIcon />,
        link:  "/admin/dashboard"  

    },

    {
        title: "Manage Products",
        icon: <ProductionQuantityLimitsRoundedIcon />,
        link:  "/admin/products"  

    },

    {
        title: "Manage Oders",
        icon: <ViewQuiltSharpIcon />,
        link: "/admin/orders"

    },


    
    {
        title: "Suppliers",
        icon: <AccountTreeIcon />,
        link: "/admin/suppliers"

    },
    
    {
        title: "Couriers",
        icon: <DeliveryDiningRoundedIcon   />,
        link: "/admin/courier"

    },


    {
        title: "Users",
        icon: <GroupIcon  />,
        link: "/admin/users"

    },
    
    {
        title: "Stock",
        icon: <Inventory2SharpIcon   />,
        link: "/admin/stock"

    },
    
 
]
