class wmMenu {
    constructor(customId=null, parentId=null, appId=null, hidden=true) {
        this.id = customId ? customId : 'a' + uuidv4();
        this.parentId = parentId;
        this.appId = appId ? null : appId;
        this.hidden = hidden;
        this.menuItems = new Object();
        this.subMenus = new Object();
    }

    addItem(menuItem) {
        if (menuItem instanceof wmMenuItem) {
            this.menuItems[menuItem.id] = menuItem;
        }
    }

    addItems(menuItems) {
        for (const item of menuItems) {
            this.addItem(item);
        }
    }

    addSubMenu(submenu) {
        if (submenu instanceof wmMenu) {
            this.subMenus[submenu.id] = submenu;
        }
    }

    addSubMenus(submenus) {
        for (const item of submenus) {
            this.addSubMenu(item);
        }
    }

    renderItem(item) {
        if (item instanceof wmMenuItem) {
            if (item.subMenuId) {
                return `
                    <li id="menuitem-${item.id}" onclick="${item.action}">
                        <div>${item.title}</div>
                        <div>&rdsh;</div>
                    </li>
                `;
            }
            return `
                <li id="menuitem-${item.id}" onclick="${item.action}">${item.title}</li>
            `;
        }
    }

    render() {
        var menu = `
            <div
                id="${this.id}"
                class="menuList"
            >
                <ul>
        `;
        if (this.parentId) {
            menu += `
                <li id="menuitem-${this.id}" onclick="currentSession.hideMenu('${this.parentId}')">
                    <div>&crarr;</div>
                </li>
            `
        }
        for (const [key, value] of Object.entries(this.menuItems)) {
            menu += this.renderItem(value);
        }
        menu += `</ul></div>`;

        return menu;
    }
}