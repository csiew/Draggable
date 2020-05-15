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
        this.menuItems[menuItem.id] = menuItem;
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
            `;
            menu += wmMenuDivider.staticRender();
        }
        for (const [key, value] of Object.entries(this.menuItems)) {
            menu += value.render();
        }
        menu += `</ul></div>`;

        return menu;
    }
}