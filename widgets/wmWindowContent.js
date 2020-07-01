class wmWindowContent {
    constructor(
        body,
        customId=null
    ) {
        this.id = customId ? customId : 'a' + uuidv4();
        this.body = body;
    }

    render() {
        return `
            <div
                id="${this.id}-content"
                class="dragWindowContent"
            >
                ${this.body}
            </div>
        `;
    }
}