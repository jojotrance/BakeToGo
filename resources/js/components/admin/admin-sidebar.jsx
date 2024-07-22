import React, { useState } from "react";
import '@css/admin-sidebar.css'; // Use the alias for the CSS import
import { SidebarData } from "../SidebarData";
import IconButton from '@mui/material/IconButton';
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded';
import ToggleOnRoundedIcon from '@mui/icons-material/ToggleOnRounded';

function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [openSubmenu, setOpenSubmenu] = useState(null); // Track the currently open submenu

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleSubmenuToggle = (index) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    return (
        <div className={`Sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
            <IconButton className="toggle-btn" onClick={toggleSidebar}>
                {isExpanded ? <ToggleOffRoundedIcon /> : <ToggleOnRoundedIcon />}
            </IconButton>
            <div className="logo-container">
                <img src="../logos/baketogo.jpg" alt="Company Logo" className="logo" />
                <span className="logo-title">BakeToGo</span>
            </div>
            <ul className="SidebarList">
                {SidebarData.map((val, key) => (
                    <React.Fragment key={key}>
                        <li
                            className={`row ${val.submenu ? "has-submenu" : ""}`}
                            id={window.location.pathname === val.link ? "active" : ""}
                            onClick={() => {
                                if (val.submenu) {
                                    handleSubmenuToggle(key);
                                } else {
                                    window.location.pathname = val.link;
                                }
                            }}
                            data-tooltip={val.title}
                        >
                            <div id="icon">{val.icon}</div>
                            <div id="title" className={`tooltip ${isExpanded ? "" : "tooltip-hidden"}`}>{val.title}</div>
                            {val.submenu && (
                                <div className={`expand-icon ${openSubmenu === key ? "open" : ""}`}>▼</div>
                            )}
                        </li>
                        {val.submenu && openSubmenu === key && (
                            <ul className="submenu">
                                {val.submenu.map((subItem, subIndex) => (
                                    <li
                                        key={subIndex}
                                        className="submenu-item"
                                        id={window.location.pathname === subItem.link ? "active" : ""}
                                        onClick={() => {
                                            window.location.pathname = subItem.link;
                                        }}
                                    >
                                        <div id="icon">{subItem.icon}</div>
                                        <div id="title" className={`tooltip ${isExpanded ? "" : "tooltip-hidden"}`}>{subItem.title}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
