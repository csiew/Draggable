class wmToolbar {
    constructor(
        id,
        items=null
    ) {
        this.id = id;
        this.items = items == null ? [] : items;
    }

    render() {
        let itemsList = this.items.map((toolbarItem) => {
            if (toolbarItem instanceof wmToolbarItem) {
                return `
                    <div
                        class="toolbarItem"
                        onclick="${item.performAction()}"
                    >
                        ${item.label}
                    </div>
                `;
            }
        })
        return `
            <div
                id="${this.id}-toolbar"
                class="toolbarContainer"
            >
                ${this.items}
            </div>
        `;
    }
}