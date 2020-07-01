class wmWindow {
    constructor(
        title,
        content,
        allowResizable=true,
        customId=null,
        appId=null,
        focused=true,
        hidden=false,
        zoomed=false,
    ) {
        this.id = customId ? customId : 'a' + uuidv4();
        this.appId = appId ? appId : uuidv4();
        this.title = title;
        this.content = new wmWindowContent(content, this.id);
        this.allowResizable = allowResizable;
        this.focused = focused;
        this.zoomed = zoomed;
        this.hidden = hidden;
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
                        <button onmouseup="currentSession.hideWindow('${this.id}')">&minus;</button>
                        <button onmouseup="currentSession.zoomWindow('${this.id}')" ${this.allowResizable === true ? '' : 'disabled'}>&plus;</button>
                    </div>
                </div>
                ${this.content.render()}
        `;
        if (this.allowResizable === true) {
            windowGen += `
                <div
                    id="${this.id}-resizer"
                    class="dragWindowResizer"
                    onmousedown="currentSession.moveWindow(${this.id})"
                >
                &#8690;
                </div>
            </div>
            `;
        }

        return windowGen;
    }
}