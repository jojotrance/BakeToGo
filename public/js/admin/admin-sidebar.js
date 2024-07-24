// File: /js/admin/admin-sidebar.js
// File: /js/admin/admin-sidebar.js

$(document).ready(function () {
    const user = JSON.parse($('#app-root').attr('data-user'));
    const role = user.role === 'admin' ? 'admin' : 'customer';
    const hideComponents = $('#app-root').attr('data-hide-components') === 'true';
    let isExpanded = true;
    let openSubmenu = null;

    const toggleSidebar = () => {
        isExpanded = !isExpanded;
        $('.Sidebar').toggleClass('expanded', isExpanded).toggleClass('collapsed', !isExpanded);
    };

    const handleSubmenuToggle = (index) => {
        openSubmenu = openSubmenu === index ? null : index;
        $('.submenu').removeClass('open');
        if (openSubmenu !== null) {
            $(`.submenu[data-submenu="${openSubmenu}"]`).addClass('open');
        }
    };

    const navigate = (link) => {
        window.location.href = link;
    };

    const renderSidebar = () => {
        $('.Sidebar').html(`
            <div class="logo-container">
                <img src="/logos/baketogo.jpg" alt="Company Logo" class="logo" />
                <span class="logo-title">BakeToGo</span>
                <button class="minimize-btn" onclick="toggleSidebar()">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
            <ul class="SidebarList">
                ${window.SidebarData.map((val, key) => `
                    <li class="row ${val.submenu ? 'has-submenu' : ''}" id="${window.location.pathname === val.link ? 'active' : ''}" onclick="${val.submenu ? `handleSubmenuToggle(${key})` : `navigate('${val.link}')`}" data-tooltip="${val.title}">
                        <div class="menu-item">
                            <div id="icon">${val.icon}</div>
                            <div id="title">${val.title}</div>
                        </div>
                        ${val.submenu ? `<div class="expand-icon ${openSubmenu === key ? 'open' : ''}">▼</div>` : ''}
                    </li>
                    ${val.submenu ? `
                        <ul class="submenu" data-submenu="${key}" style="display: ${openSubmenu === key ? 'block' : 'none'}">
                            ${val.submenu.map(subItem => `
                                <li class="submenu-item" id="${window.location.pathname === subItem.link ? 'active' : ''}" onclick="navigate('${subItem.link}')">
                                    <div class="menu-item">
                                        <div id="icon">${subItem.icon}</div>
                                        <div id="title">${subItem.title}</div>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    ` : ''}
                `).join('')}
            </ul>
        `);
    };

    if (role === 'admin' && !hideComponents) {
        renderSidebar();
    }

    // Ensure global functions are available
    window.toggleSidebar = toggleSidebar;
    window.handleSubmenuToggle = handleSubmenuToggle;
    window.navigate = navigate;
});
