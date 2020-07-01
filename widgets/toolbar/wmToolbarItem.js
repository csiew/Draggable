class wmToolbarItem {
    constructor(
        label=null,
        action=null
    ) {
        this.label = label == null ? "Item" : label;
        this.action = action;
    }

    performAction() {
        if (this.action == null) {
            console.log(`${this.label} pressed`);
        } else {
            this.action();
        }
    }
}