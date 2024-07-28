$(document).ready(function () {
    const user = JSON.parse($('#app-root').attr('data-user'));
    const role = user.role === 'admin' ? 'admin' : 'customer';
    const hideComponents = $('#app-root').attr('data-hide-components') === 'true';
    let isExpanded = true;
    let openSubmenu = null;

    console.log('Role:', role);
    console.log('Hide Components:', hideComponents);

    window.toggleSidebar = function() {
        console.log('Toggling sidebar');
        isExpanded = !isExpanded;
        $('.Sidebar').toggleClass('expanded', isExpanded).toggleClass('collapsed', !isExpanded);
    };

    window.handleSubmenuToggle = function(index) {
        console.log('Toggling submenu:', index);
        if (openSubmenu === index) {
            openSubmenu = null;
            $(`.submenu[data-submenu="${index}"]`).slideUp();
        } else {
            openSubmenu = index;
            $('.submenu').slideUp();
            $(`.submenu[data-submenu="${index}"]`).slideDown();
        }
        $('.expand-icon').removeClass('open');
        $(`.row[data-key="${index}"] .expand-icon`).toggleClass('open', openSubmenu === index);
    };

    window.navigate = function(link) {
        console.log('Navigating to:', link);
        window.location.href = link;
    };

    window.renderSidebar = function() {
        console.log('Rendering sidebar');
        if (!Array.isArray(window.SidebarData)) {
            console.error('SidebarData is not an array:', window.SidebarData);
            return;
        }

        const sidebarHTML = `
            <div class="logo-container">
                <img src="/logos/baketogo.jpg" alt="Company Logo" class="logo" />
                <span class="logo-title">BakeToGo</span>
                <button class="minimize-btn" onclick="toggleSidebar()">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
            <ul class="SidebarList">
                ${window.SidebarData.map((val, key) => `
                    <li class="row ${val.submenu ? 'has-submenu' : ''}" 
                        id="${window.location.pathname === val.link ? 'active' : ''}" 
                        data-tooltip="${val.title}"
                        data-key="${key}">
                        <div class="menu-item" onclick="${val.submenu ? `handleSubmenuToggle(${key})` : `navigate('${val.link}')`}">
                            <div id="icon">${val.icon}</div>
                            <div id="title">${val.title}</div>
                            ${val.submenu ? '<div class="expand-icon">▼</div>' : ''}
                        </div>
                        ${val.submenu ? `
                            <ul class="submenu" data-submenu="${key}">
                                ${val.submenu.map(subItem => `
                                    <li class="submenu-item" 
                                        id="${window.location.pathname === subItem.link ? 'active' : ''}" 
                                        onclick="navigate('${subItem.link}')">
                                        <div class="menu-item">
                                            <div id="icon">${subItem.icon}</div>
                                            <div id="title">${subItem.title}</div>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        ` : ''}
                    </li>
                `).join('')}
            </ul>
        `;

        $('.Sidebar').html(sidebarHTML);
    }

    if (role === 'admin' && !hideComponents) {
        window.renderSidebar();
    }
});
