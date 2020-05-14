class wmMenuItem {
    constructor(title, action, enabled=false, customId=null) {
        this.id = customId == null ? uuidv4() : customId;
        this.title = title;
        this.action = action;
        this.enabled = enabled ? true : false;
    }
}