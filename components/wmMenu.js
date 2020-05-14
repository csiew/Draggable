class wmMenu {
    constructor(customId=null) {
        this.id = customId == null ? uuidv4() : customId;
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