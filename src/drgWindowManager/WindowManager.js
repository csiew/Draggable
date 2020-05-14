import _ from '../resources/Resources.js';
import wmWindow from './wmWindow.js';

class WindowManager {
    constructor() {
        this.container = document.querySelector("#container");
        this.windowReg = new Map();
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
            this.renderWindow(newWindow);
            this.renderTasklistItem(newWindow);
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
            windowInfo.width = document.getElementById(newWindow.id).getBoundingClientRect().width;
            windowInfo.width = document.getElementById(newWindow.id).getBoundingClientRect().height;
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

    renderWindow(newWindow) {
        var windowGen = `
            <div
                id="${newWindow.id}"
                class="dragWindow"
                onclick="currentSession.raiseWindow('${newWindow.id}')"
            >
                <div
                    id="${newWindow.id}-header"
                    class="dragWindowHeader"
                    onmousedown="currentSession.moveWindow(${newWindow.id})"
                >
                    <div class="dragWindowControls">
                        <button onmouseup="currentSession.destroyWindow('${newWindow.id}')">&times;</button>
                    </div>
                    <div class="dragWindowHeaderTitle">
                        ${newWindow.title}
                    </div>
                    <div class="dragWindowControls">
                    ` + (
                        newWindow.allowResizable === true ?
                        `<button onmouseup="currentSession.zoomWindow('${newWindow.id}')">&plus;</button>` :
                        ''
                    ) +
                    ` 
                        <button onmouseup="currentSession.hideWindow('${newWindow.id}')">&minus;</button>
                    </div>
                </div>
                <div
                    id="${newWindow.id}-content"
                    class="dragWindowContent"
                >
                    ${newWindow.body}
                </div>
        `;
        if (newWindow.allowResizable === true) {
            windowGen += `
                <div
                    id="${newWindow.id}-resizer"
                    class="dragWindowResizer"
                    onmousedown="currentSession.moveWindow(${newWindow.id})"
                >
                </div>
            </div>
            `;
        }

        document.getElementById('container').innerHTML += windowGen;
    }

    renderTasklistItem(newWindow) {
        document.getElementById('taskbarTasklist').innerHTML += `
            <button id="tasklist-${newWindow.id}" onclick="currentSession.toggleTasklistItem('${newWindow.id}')">${newWindow.title}</button>
        `;
    }

    toggleTasklistItem(windowId) {
        const thisWindow = this.windowReg.get(windowId);
        if (thisWindow.hidden === false && thisWindow.focused === true) {
            this.hideWindow(windowId);
        } else {
            this.raiseWindowHelper(windowId);
        }
    }

    destroyWindow(windowId) {
        document.getElementById(windowId).remove();
        document.getElementById(`tasklist-${windowId}`).remove();
        if (document.getElementById(`taskman-item-${windowId}`)) {
            document.getElementById(`taskman-item-${windowId}`).remove();
        }
        this.windowReg.delete(windowId);
    }

    hideWindow(windowId) {
        var windowMain = document.getElementById(windowId);
        var tasklistItem = document.getElementById(`tasklist-${windowId}`);

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
            var windowMain = document.getElementById(windowId);
            
            if (this.windowReg.zoomed) {
                // restore to default dimensions
                windowMain.style.width = this.windowReg.get(windowId).width;
                windowMain.style.height = this.windowReg.get(windowId).height;
                this.windowReg.zoomed = false;
            } else {
                // fill screen (except taskbar)
                const taskbarHeight = document.getElementById('taskbar').getBoundingClientRect().height;
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

        if (document.getElementById(windowId)) {
            // if present, the header is where you move the DIV from:
            document.getElementById(windowId).onmousedown = focusEvent;
        }
    
        function focusEvent(e) {
            e = e || window.event;
            e.preventDefault();
            document.onmouseup = closeFocusEvent;
            document.getElementById(windowId).style.outline = '1px solid red';
            helper();
        }
    
        function closeFocusEvent() {
            if (document.getElementById(windowId)) {
                document.getElementById(windowId).style.outline = 'none';
            }
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
        const windowMain = document.getElementById(windowId);
        const tasklistItem = document.getElementById(`tasklist-${windowId}`);

        // Raise window and focus
        windowMain.style.zIndex = LEVEL_FOCUSED;
        document.getElementById(windowId + '-header').style.background = WINDOW_HEADER_BG_COLOR_FOCUSED;

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
        const windowMain = document.getElementById(windowId);
        const tasklistItem = document.getElementById(`tasklist-${windowId}`);

        // Lower window and unfocus
        windowMain.style.zIndex = LEVEL_UNFOCUSED;
        document.getElementById(windowId + '-header').style.background = WINDOW_HEADER_BG_COLOR_UNFOCUSED;

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
        if (document.getElementById(elmnt.id + "-header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
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
            document.getElementById(elmnt.id).style.outline = '1px solid red';
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
            if (document.getElementById(elmnt.id)) {
                document.getElementById(elmnt.id).style.outline = 'none';
            }
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    resizeWindow(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "-resizer")) {
            // if present, the resizer is where you move the DIV from:
            document.getElementById(elmnt.id + "-resizer").onmousedown = dragMouseDown;
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
            document.getElementById(elmnt.id).style.outline = '1px solid red';
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
            document.getElementById(elmnt.id).style.outline = 'none';
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    moveWindow(windowId) {
        this.dragWindow(document.getElementById(windowId));
        this.resizeWindow(document.getElementById(windowId));
    }
}

export default WindowManager;
