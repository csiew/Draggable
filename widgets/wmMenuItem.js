class wmMenuItem {
    constructor(title, action, enabled=true, customId=null) {
        this.id = customId ? customId : uuidv4();
        this.title = title;
        this.action = action;
        this.enabled = enabled;
    }
}