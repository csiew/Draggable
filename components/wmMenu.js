class wmMenu {
    constructor(customId=null, parentId=null, appId=null) {
        this.id = customId ? uuidv4() : customId;
        this.parentId = parentId ? uuidv4() : parentId;
        this.appId = appId ? null : appId;
        this.menuItems = new Object();
    }

    addItem(menuItem) {
        if (menuItem instanceof wmMenuItem) {
            this.menuItems[menuItem.id] = menuItem;
        }
    }

    addItems(menuItemsArray) {
        for (const item of menuItemsArray) {
            this.addItem(item);
        }
    }

    renderItem(item) {
        if (item instanceof wmMenuItem) {
            return `
                <li id="menuitem-${item.id}" onclick="menu">${item.title}</li>
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
        for (const [key, value] of this.menuItems) {
            menu += this.createEntry(key, value.title);
        }
        menu += `</ul></div>`;

        return menu;
    }
}