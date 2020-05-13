const LEVEL_FOCUSED = 100;
const LEVEL_UNFOCUSED = 5;

const DARK_BORDER_COLOR = "#c0c0c0";
const LIGHT_BORDER_COLOR = "#f1f1f1";

var currentSession;

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class wmWindow {
    constructor(title, body, allowResizable=true) {
        this.id = 'a' + uuidv4();;
        this.title = title;
        this.body = body;
        this.allowResizable = allowResizable;
    }

    getId() {
        return `${this.id}`;
    }
}

class wmSession {
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
        let addWindowToSession = async () => {
            this.renderWindow(newWindow);
            this.renderTasklistItem(newWindow);
        };
        addWindowToSession().then(() => {
            this.windowReg.set(newWindow.id, newWindow);
            var allKeys = this.windowReg.keys();
    
            // Make all windows draggable
            for (const key of allKeys) {
                this.moveWindow(key);
            }
        });
    }

    renderWindow(newWindow) {
        var windowGen = `
            <div
                id="${newWindow.id}"
                class="dragWindow"
                onmouseover="currentSession.raiseWindow(${newWindow.id})"
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

        const windowMain = document.getElementById(`${newWindow.id}`);

        // Show window
        windowMain.style.visibility = 'visible';
        windowMain.style.display = 'flex';
    }

    renderTasklistItem(newWindow) {
        document.getElementById('taskbarTasklist').innerHTML += `
            <button id="tasklist-${newWindow.id}" onclick="currentSession.hideWindow('${newWindow.id}')">${newWindow.title}</button>
        `;

        const tasklistItem = document.getElementById(`tasklist-${newWindow.id}`);

        // Engraved tasklist button
        tasklistItem.style.borderBottomColor = LIGHT_BORDER_COLOR;
        tasklistItem.style.borderRightColor = LIGHT_BORDER_COLOR;
        tasklistItem.style.borderTopColor = DARK_BORDER_COLOR;
        tasklistItem.style.borderLeftColor = DARK_BORDER_COLOR;
    }

    destroyWindow(windowId) {
        document.getElementById(windowId).remove();
        document.getElementById(`tasklist-${windowId}`).remove();
        this.windowReg.delete(windowId);
    }

    purge() {
        for (const key of this.windowReg.keys()) {
            this.destroyWindow(key);
        }
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
        } else {
            // Show window
            windowMain.style.visibility = 'visible';
            windowMain.style.display = 'flex';
            // Engraved tasklist button
            tasklistItem.style.borderBottomColor = LIGHT_BORDER_COLOR;
            tasklistItem.style.borderRightColor = LIGHT_BORDER_COLOR;
            tasklistItem.style.borderTopColor = DARK_BORDER_COLOR;
            tasklistItem.style.borderLeftColor = DARK_BORDER_COLOR;
        }
    }

    raiseWindow(elmnt) {
        console.log(`Attempting to raise window: ${elmnt.id}`);
        var allKeys = this.windowReg.keys();

        if (document.getElementById(elmnt.id + "-header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.id.onmousedown = focusEvent;
        }
    
        function focusEvent(e) {
            e = e || window.event;
            e.preventDefault();
            document.onmouseup = closeFocusEvent;
            document.getElementById(elmnt.id).style.outline = '1px solid red';
            // update z-index
            for (const key of allKeys) {
                if (elmnt.id === key) {
                    document.getElementById(elmnt.id).style.zIndex = LEVEL_FOCUSED;
                } else {
                    document.getElementById(key).style.zIndex = LEVEL_UNFOCUSED;
                }
            }
        }
    
        function closeFocusEvent() {
            document.getElementById(elmnt).style.outline = 'none';
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
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

class TaskManager {
    run() {
        var allTasks = "<div class='taskman'><ul>"
        for (const [key, value] of currentSession.windowReg) {
            allTasks += `
                <li>
                    <div>${value.title}</div>
                    <button onclick="currentSession.destroyWindow('${key}')">Kill</button>
                </li>
            `
        }
        allTasks += "</ul></div>"
        var taskman = new wmWindow("Task Manager", allTasks, false);
        currentSession.createWindow(taskman);
    }
}

class PoolManager {
    constructor() {
        this.pool = new Object();
    }

    add(title, content) {
        const newWindow = new wmWindow(title, content);
        this.pool[newWindow.id] = newWindow;
    }

    batchAdd(batchArray) {
        for (const [title, content] of batchArray) {
            this.add(title, content);
        }
    }

    run(windowId) {
        currentSession.createWindow(this.pool[windowId]);
    }

    runAll() {
        for (const item of Object.values(this.pool)) {
            currentSession.createWindow(item);
        }
    }

    poolman() {
        var allItems = "<div class='taskman'><ul>";
        for (const [key, value] of Object.entries(this.pool)) {
            allItems += `
                <li>
                    <div>${value.title}</div>
                    <button onclick="pool.run('${key}')">Run</button>
                </li>
            `
        }
        allItems += `<button onclick="pool.runAll()">Run All</button></ul></div>`
        var poolman = new wmWindow("Pool Manager", allItems, false);
        currentSession.createWindow(poolman);
    }
}

class Preferences {
    constructor() {
        this.preferences = new Object();
        this.backgrounds = new Object();

        this.backgrounds['color'] = new Object();
        this.backgrounds['img'] = new Object();

        var colors = {
            'Tomato': 'tomato',
            'Dark Cyan': 'darkcyan',
            'Steel Blue': 'steelblue'
        };
        var imgs = {
            'Night Sky': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            'Rath of the Earth': 'https://images.unsplash.com/photo-1554232682-b9ef9c92f8de?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
            'Gunung Bromo': 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80'
        };

        for (const [name, colorCode] of Object.entries(colors)) {
            this.backgrounds['color'][name] = colorCode;
        }
        for (const [name, imgUrl] of Object.entries(imgs)) {
            this.backgrounds['img'][name] = imgUrl;
        }
    }

    setBackgroundColor(bgColor) {
        document.body.style.backgroundImage = 'none';
        document.body.style.background = bgColor;
    }

    setBackgroundImg(imgUrl) {
        document.body.style.backgroundImage = `url(${imgUrl})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundOrigin = 'center';
    }

    setBackgroundWindow() {
        var allItems = "<div class='taskman'><ul>";
        allItems += `
            <li>
                <h3>Colors</h3>
            </li>
        `;
        for (const [name, value] of Object.entries(this.backgrounds['color'])) {
            allItems += `
                <li>
                    <div>${name}</div>
                    <button onclick="prefs.setBackgroundColor('${value}')">Set</button>
                </li>
            `
        }
        allItems += `
            <li>
                <h3>Images</h3>
            </li>
        `;
        for (const [name, value] of Object.entries(this.backgrounds['img'])) {
            allItems += `
                <li>
                    <div>${name}</div>
                    <button onclick="prefs.setBackgroundImg('${value}')">Set</button>
                </li>
            `
        }
        var prefsBackground = new wmWindow("Background", allItems, false);
        currentSession.createWindow(prefsBackground);
    }
}

class SessionManager {
    constructor() {
        this.windowReg = new Map();
    }
}

currentSession = new wmSession();
taskmgr = new TaskManager();
pool = new PoolManager();
prefs = new Preferences();
pool.batchAdd([
    [
        "Burgundy",
        "That might make a good name for this."
    ],
    [
        "Editor",
        `
            <button>Open</button>
            <button>Save</button>
            <button>Save As...</button>
        `
    ],
    [
        "Video",
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/lWM2kqdP1bc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    ]
]);
