class wmTasklistItem {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }

    render() {
        return `
            <button id="tasklist-${this.id}" onclick="currentSession.toggleTasklistItem('${this.id}')">${this.title}</button>
        `;
    }
}