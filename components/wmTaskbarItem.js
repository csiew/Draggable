class wmTaskbarItem {
    constructor(id=null, title, action) {
        this.id = id == null ? null : id;
        this.title = title;
        this.action = action;
    }

    render() {
        return `
            <button ${this.id == null ? '' : 'id="' + this.id + '"'} onclick="${this.action}">${this.title}</button>
        `;
    }
}