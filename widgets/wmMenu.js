class wmMenu {
    constructor(customId=null, parentId=null, appId=null, hidden=true) {
        this.id = customId ? customId : 'a' + uuidv4();
        this.parentId = parentId ? uuidv4() : parentId;
        this.appId = appId ? null : appId;
        this.menuItems = new Object();
        this.hidden = hidden;
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
        for (const [key, value] of Object.entries(this.menuItems)) {
            menu += this.renderItem(value);
        }
        menu += `</ul></div>`;

        return menu;
    }
}