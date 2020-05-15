class wmMenuItem {
    constructor(
        title,
        action,
        subMenuId=null,
        enabled=true,
        customId=null
    ) {
        this.id = customId ? customId : uuidv4();
        this.title = title;
        this.action = action;
        this.subMenuId = subMenuId;
        this.enabled = enabled;
    }

    render() {
        if (this.subMenuId) {
            return `
                <li id="menuitem-${this.id}" onclick="${this.action}">
                    <div>${this.title}</div>
                    <div>&rdsh;</div>
                </li>
            `;
        }
        return `
            <li id="menuitem-${this.id}" onclick="${this.action}">${this.title}</li>
        `;
    }
}