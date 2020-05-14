class wmApp {
    constructor(name, customId=null) {
        this.id = customId ? uuidv4() : customId;
        this.name = name;
        this.menubar = new Map();
    }
}