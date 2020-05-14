class wmWindow {
    constructor(
        title,
        body,
        allowResizable=true,
        customId=null,
        focused=true,
        hidden=false,
        zoomed=false,
        customWidth=0,
        customHeight=0
    ) {
        this.id = customId ? customId : 'a' + uuidv4();
        this.title = title;
        this.body = body;
        this.allowResizable = allowResizable;
        this.focused = focused ? true : false;
        this.zoomed = zoomed ? true : false;
        this.hidden = hidden ? true : false;
        this.width = (customWidth && customWidth < DEFAULT_WIDTH) ? DEFAULT_WIDTH : customWidth;
        this.height = (customHeight && customHeight < DEFAULT_HEIGHT) ? DEFAULT_HEIGHT : customHeight;
    }

    render() {
        var windowGen = `
            <div
                id="${this.id}"
                class="dragWindow"
                onclick="currentSession.raiseWindow('${this.id}')"
            >
                <div
                    id="${this.id}-header"
                    class="dragWindowHeader"
                    onmousedown="currentSession.moveWindow(${this.id})"
                >
                    <div class="dragWindowControls">
                        <button onmouseup="currentSession.destroyWindow('${this.id}')">&times;</button>
                    </div>
                    <div class="dragWindowHeaderTitle">
                        ${this.title}
                    </div>
                    <div class="dragWindowControls">
                    ` + (
                        this.allowResizable === true ?
                        `<button onmouseup="currentSession.zoomWindow('${this.id}')">&plus;</button>` :
                        ''
                    ) +
                    ` 
                        <button onmouseup="currentSession.hideWindow('${this.id}')">&minus;</button>
                    </div>
                </div>
                <div
                    id="${this.id}-content"
                    class="dragWindowContent"
                >
                    ${this.body}
                </div>
        `;
        if (this.allowResizable === true) {
            windowGen += `
                <div
                    id="${this.id}-resizer"
                    class="dragWindowResizer"
                    onmousedown="currentSession.moveWindow(${this.id})"
                >
                </div>
            </div>
            `;
        }

        return windowGen;
    }
}