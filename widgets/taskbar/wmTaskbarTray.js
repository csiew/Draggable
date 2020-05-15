class wmTaskbarTray extends wmTaskbarItem {
    constructor() {
        super('taskbarTray');
        this.trayItems = new Map();
    }

    render() {
        var tray = `
            <div class='taskbarTray' id='${this.id}'>
                <ul>
        `;
        for (const [key, value] of this.trayItems) {
            tray += value.render();
        }
        tray += "</ul></div>";

        return tray;
    }

    addItem(newItem) {
        if (newItem instanceof wmTaskbarTrayItem) {
            this.trayItems.set(newItem.id, newItem);
            wmElements.draw(this.id, newItem.render());
        }
    }

    addItems(items) {
        for (const item of items) {
            this.addItem(item);
        }
    }
}