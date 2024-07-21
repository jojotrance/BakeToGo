import React, { useState } from "react";
import '@css/admin-sidebar.css'; // Ensure this path is correct
import { SidebarData } from "../SidebarData";
import IconButton from '@mui/material/IconButton';
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded';
import ToggleOnRoundedIcon from '@mui/icons-material/ToggleOnRounded';

function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`Sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
            <IconButton className="toggle-btn" onClick={toggleSidebar}>
                {isExpanded ? <ToggleOffRoundedIcon /> : <ToggleOnRoundedIcon />}
            </IconButton>
            <img src="../logos/baketogo.jpg" alt="Company Logo" className="logo" />
            <ul className="SidebarList">
                {SidebarData.map((val, key) => {
                    return (
                        <li
                            key={key}
                            className="row"
                            id={window.location.pathname === val.link ? "active" : ""}
                            onClick={() => {
                                window.location.pathname = val.link;
                            }}
                            data-tooltip={val.title} // Add tooltip text here
                        >
                            <div id="icon">{val.icon}</div>
                            <div id="title" className={`tooltip ${isExpanded ? "" : "tooltip-hidden"}`}>{val.title}</div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Sidebar;
