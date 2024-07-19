    import React, { useState } from 'react';
    import '@css/customer-sidebar.css'; // Use the alias for the CSS import

    const categories = [
        { name: 'Insight', icon: '💡' },
        { name: 'Cards', icon: '💳' },
        { name: 'Market Place', icon: '🛒' },
        { name: 'Sales Expert', icon: '💼' },
        { name: 'Chartly', icon: '📊' },
        { name: 'Newstand', icon: '📰' },
        { name: 'Golden Bar', icon: '📈' }
    ];

    const CustomerSidebar = () => {
        const [expanded, setExpanded] = useState({});
        const [isCollapsed, setIsCollapsed] = useState(false);

        const toggleExpand = (category) => {
            setExpanded((prevState) => ({
                ...prevState,
                [category]: !prevState[category]
            }));
        };

        const toggleSidebar = () => {
            setIsCollapsed(!isCollapsed);
        };

        return (
            <div className={`floating-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <button className="toggle-button" onClick={toggleSidebar}>
                    {isCollapsed ? '>' : '<'}
                </button>
                <h3 className="sidebar-title">Categories</h3>
                <ul className="sidebar-list">
                    {categories.map((category, index) => (
                        <li key={index} className="category-item" onClick={() => toggleExpand(category.name)}>
                            <span className="icon">{category.icon}</span>
                            <span className="category-name">{category.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    export default CustomerSidebar;
