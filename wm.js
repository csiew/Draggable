const LEVEL_FOCUSED = 100;
const LEVEL_UNFOCUSED = 5;

const DEFAULT_WIDTH = '180px';
const DEFAULT_HEIGHT = '120px';

const DARK_BORDER_COLOR = "#c0c0c0";
const LIGHT_BORDER_COLOR = "#f1f1f1";

const WINDOW_HEADER_BG_COLOR_FOCUSED = "#800020";
const WINDOW_HEADER_BG_COLOR_UNFOCUSED = "#A07983";

var currentSession, taskmgr, pool, prefs;

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class wmElements {
    static draw(id, content) {
        document.getElementById(id).innerHTML += content;
    }

    static destroy(id) {
        document.getElementById(id).remove();
    }

    static bounds(id) {
        return document.getElementById(id).getBoundingClientRect();
    }

    static get(id) {
        return document.getElementById(id);
    }
}

class wmSession {
    constructor() {
        this.container = document.querySelector("#container");
        this.windowReg = new Map();
        this.taskbar = new wmTaskbar();
    }

    init() {
        wmElements.draw('container', this.taskbar.render());
        this.taskbar.addLeftItems([
            new wmTaskbarItem(null, "TaskMan", "taskmgr.run()"),
            new wmTaskbarItem(null, "PoolMan", "pool.poolman()"),
            new wmTaskbarItem(null, "New", "currentSession.createWindow()"),
        ]);
        this.taskbar.addRightItems([
            new wmTaskbarItem(null, "Backgrounds", "prefs.setBackgroundWindow()"),
        ]);
        this.resizeEventListener();
    }

    resizeEventListener() {
        document.onresize = resize;
        document.onfullscreenchange = resize;

        const tasklistMaxWidth = () => {
            // Set tasklist maximum width to maximum available space between both ends of taskbar
            wmElements.get(this.taskbar.tasklistId).style.maxWidth = wmElements.bounds(this.taskbar.tasklistId).width;
            console.log("Resized taskbar");
        }
    
        function resize(e) {
            e = e || window.event;
            e.preventDefault();
            tasklistMaxWidth();
        }
    }

    createWindow(customWindow) {
        var newWindow;
        if (customWindow === undefined) {
            newWindow = new wmWindow("Hello World", "Lorem ipsum");
        } else {
            newWindow = customWindow;
        }
        let addWindowToRegistry = async () => {
            this.windowReg.set(newWindow.id, newWindow);
        }
        let addWindowToSession = async () => {
            wmElements.draw('container', newWindow.render());
            this.taskbar.addTask(newWindow);
            taskmgr.add(newWindow.id, newWindow.title);
        };
        let updateSession = async () => {
            var allKeys = this.windowReg.keys();
    
            // Make all windows draggable
            for (const key of allKeys) {
                this.moveWindow(key);
            }

            // Use auto dimensions as default dimensions
            var windowInfo = this.windowReg.get(newWindow.id);
            windowInfo.width = wmElements.bounds(newWindow.id).width;
            windowInfo.width = wmElements.bounds(newWindow.id).height;
            this.windowReg.set(newWindow.id, windowInfo);
        }
        addWindowToRegistry().then(() => {
            addWindowToSession().then(() => {
                updateSession().then(() => {
                    this.raiseWindow(newWindow.id);
                });
            });
        });
    }

    toggleTasklistItem(windowId) {
        const thisWindow = this.windowReg.get(windowId);
        console.log(thisWindow);
        if (thisWindow.hidden === false && thisWindow.focused === true) {
            this.hideWindow(windowId);
        } else {
            this.raiseWindowHelper(windowId);
        }
    }

    destroyWindow(windowId) {
        wmElements.destroy(windowId);
        wmElements.destroy(`tasklist-${windowId}`);
        if (wmElements.get(`taskman-item-${windowId}`)) {
            wmElements.destroy(`taskman-item-${windowId}`);
        }
        this.windowReg.delete(windowId);
    }

    hideWindow(windowId) {
        var windowMain = wmElements.get(windowId);
        var tasklistItem = wmElements.get(`tasklist-${windowId}`);

        if (windowMain.style.visibility === 'visible') {
            // Hide window
            windowMain.style.visibility = 'collapse';
            windowMain.style.display = 'none';
            // Embossed tasklist button
            tasklistItem.style.borderBottomColor = DARK_BORDER_COLOR;
            tasklistItem.style.borderRightColor = DARK_BORDER_COLOR;
            tasklistItem.style.borderTopColor = LIGHT_BORDER_COLOR;
            tasklistItem.style.borderLeftColor = LIGHT_BORDER_COLOR;
            // Update registry
            var windowEntry = this.windowReg.get(windowId);
            windowEntry.hidden = true;
            this.windowReg.set(windowId, windowEntry);
        } else {
            // Show window
            windowMain.style.visibility = 'visible';
            windowMain.style.display = 'flex';
            // Engraved tasklist button
            tasklistItem.style.borderBottomColor = LIGHT_BORDER_COLOR;
            tasklistItem.style.borderRightColor = LIGHT_BORDER_COLOR;
            tasklistItem.style.borderTopColor = DARK_BORDER_COLOR;
            tasklistItem.style.borderLeftColor = DARK_BORDER_COLOR;
            // Update registry
            var windowEntry = this.windowReg.get(windowId);
            windowEntry.hidden = false;
            this.windowReg.set(windowId, windowEntry);
        }
    }

    zoomWindow(windowId) {
        if (this.windowReg.has(windowId) && this.windowReg.get(windowId).allowResizable) {
            var windowMain = wmElements.get(windowId);
            
            if (this.windowReg.zoomed) {
                // restore to default dimensions
                windowMain.style.width = this.windowReg.get(windowId).width;
                windowMain.style.height = this.windowReg.get(windowId).height;
                this.windowReg.zoomed = false;
            } else {
                // fill screen (except taskbar)
                const taskbarHeight = wmElements.get(this.taskbar.id).getBoundingClientRect().height;
                windowMain.style.top = taskbarHeight + 'px';
                windowMain.style.left = '0px';
                windowMain.style.width = window.innerWidth;
                windowMain.style.height = window.innerHeight - taskbarHeight;
                this.windowReg.zoomed = true;
            }
        }
    }

    raiseWindow(windowId) {
        const helper = async () => {
            this.raiseWindowHelper(windowId);
        }

        if (wmElements.get(windowId)) {
            // if present, the header is where you move the DIV from:
            wmElements.get(windowId).onmousedown = focusEvent;
        }
    
        function focusEvent(e) {
            e = e || window.event;
            e.preventDefault();
            document.onmouseup = closeFocusEvent;
            helper();
        }
    
        function closeFocusEvent() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    raiseWindowHelper(windowId) {
        var allKeys = this.windowReg.keys();
        // update z-index
        for (const key of allKeys) {
            if (windowId === key) {
                // focus a window
                this.styleWindowFocus(windowId);
            } else {
                // unfocus a window
                this.styleWindowUnfocus(key);
            }
        }
    }

    styleWindowFocus(windowId) {
        const windowMain = wmElements.get(windowId);
        const tasklistItem = wmElements.get(`tasklist-${windowId}`);

        // Raise window and focus
        windowMain.style.zIndex = LEVEL_FOCUSED;
        wmElements.get(windowId + '-header').style.background = WINDOW_HEADER_BG_COLOR_FOCUSED;

        // Show window
        windowMain.style.visibility = 'visible';
        windowMain.style.display = 'flex';

        // Engraved tasklist button
        tasklistItem.style.borderBottomColor = LIGHT_BORDER_COLOR;
        tasklistItem.style.borderRightColor = LIGHT_BORDER_COLOR;
        tasklistItem.style.borderTopColor = DARK_BORDER_COLOR;
        tasklistItem.style.borderLeftColor = DARK_BORDER_COLOR;

        // Update registry
        var windowEntry = this.windowReg.get(windowId);
        windowEntry.focused = true;
        this.windowReg.set(windowId, windowEntry);
    }

    styleWindowUnfocus(windowId) {
        const windowMain = wmElements.get(windowId);
        const tasklistItem = wmElements.get(`tasklist-${windowId}`);

        // Lower window and unfocus
        windowMain.style.zIndex = LEVEL_UNFOCUSED;
        wmElements.get(windowId + '-header').style.background = WINDOW_HEADER_BG_COLOR_UNFOCUSED;

        // Embossed tasklist button
        tasklistItem.style.borderBottomColor = DARK_BORDER_COLOR;
        tasklistItem.style.borderRightColor = DARK_BORDER_COLOR;
        tasklistItem.style.borderTopColor = LIGHT_BORDER_COLOR;
        tasklistItem.style.borderLeftColor = LIGHT_BORDER_COLOR;

        // Update registry
        var windowEntry = this.windowReg.get(windowId);
        windowEntry.focused = false;
        this.windowReg.set(windowId, windowEntry);
    }

    dragWindow(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (wmElements.get(elmnt.id + "-header")) {
            // if present, the header is where you move the DIV from:
            wmElements.get(elmnt.id + "-header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }
        this.raiseWindow(elmnt.id);
    
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
    
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
    
        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    resizeWindow(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (wmElements.get(elmnt.id + "-resizer")) {
            // if present, the resizer is where you move the DIV from:
            wmElements.get(elmnt.id + "-resizer").onmousedown = dragMouseDown;
        }
    
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
    
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = e.clientX - pos3;
            pos2 = e.clientY - pos4;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // resize window:
            elmnt.style.width = (elmnt.getBoundingClientRect().width + pos1) + "px";
            elmnt.style.height = (elmnt.getBoundingClientRect().height + pos2) + "px";
        }
    
        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    moveWindow(windowId) {
        this.dragWindow(wmElements.get(windowId));
        this.resizeWindow(wmElements.get(windowId));
    }
}
