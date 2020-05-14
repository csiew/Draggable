class wmTasklistItem {
    constructor(id, title) {
        this.id = `tasklist-${id}`;
        this.title = title;
    }

    render() {
        return `
            <button id="${this.id}" onclick="currentSession.toggleTasklistItem('${this.id}')">${this.title}</button>
        `;
    }
}