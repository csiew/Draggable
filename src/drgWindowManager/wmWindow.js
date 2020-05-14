import _ from '../resources/Resources.js';

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
        this.id = customId ? customId : 'a' + this.uuidv4();
        this.title = title;
        this.body = body;
        this.allowResizable = allowResizable;
        this.focused = focused ? true : false;
        this.zoomed = zoomed ? true : false;
        this.hidden = hidden ? true : false;
        this.width = (customWidth && customWidth < DEFAULT_WIDTH) ? DEFAULT_WIDTH : customWidth;
        this.height = (customHeight && customHeight < DEFAULT_HEIGHT) ? DEFAULT_HEIGHT : customHeight;
    }

    getId() {
        return `${this.id}`;
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export default wmWindow;