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
}