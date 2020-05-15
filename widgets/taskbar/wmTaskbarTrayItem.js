class wmTaskbarTrayItem extends wmTaskbarItem {
    constructor(id=null, label=null, icon=null, onClick=false, onLoad=false, action=null) {
        super(id === null ? uuidv4() : id);
        this.label = label;
        this.icon = icon;
        this.onClick = onClick;
        this.onLoad = onLoad;
        this.action = action;
    }

    render() {
        return `
            <li
                id="${this.id}"
                ${this.onClick == null ? '' : 'onclick="' + this.action + '"'}
                ${this.onLoad == null ? '' : 'onload="' + this.action + '"'}
            >
                ${this.icon == null ? '' : '<img id="taskbar-tray-${this.id}-icon" class="taskbarTrayItemIcon" src="' + this.icon + '" height="' + globals.BODY_FONT_SIZE() + '">'}
                <div id="taskbar-tray-${this.id}-label" class="taskbarTrayItemLabel">
                    ${this.label}
                </div>
            </li>
        `;
    }

    setIcon(newIcon) {
        this.icon = newIcon;
        wmElements.get('taskbar-tray-' + this.id + '-icon').src = newLabel;
    }

    setLabel(newLabel) {
        this.label = newLabel;
        wmElements.get('taskbar-tray-' + this.id + '-label').innerHTML = newLabel;
    }
}