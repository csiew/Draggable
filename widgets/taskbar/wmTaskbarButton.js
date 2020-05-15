class wmTaskbarButton extends wmTaskbarItem {
    constructor(id=null, title, action) {
        super(id);
        this.title = title;
        this.action = action;
    }

    render() {
        return `
            <button ${this.id == null ? '' : 'id="' + this.id + '"'} onclick="${this.action}">${this.title}</button>
        `;
    }
}