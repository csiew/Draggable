class wmSession {
    constructor() {
        this.container = document.querySelector("#container");
        this.windowReg = new Map();
        this.menuReg = new Map();
        this.taskbar = new wmTaskbar();
        this.taskbarTray = new wmTaskbarTray();
        this.launcher = new Launcher();
    }

    init() {
        wmElements.draw('container', this.taskbar.render());
        this.resizeEventListener();

        this.taskbar.addLeftItems([
            new wmTaskbarButton("taskbarLauncher", "Launcher", "currentSession.launcherHelper()"),
        ]);
        this.taskbar.addRightItems([
            this.taskbarTray,
        ]);

        this.createMenu(this.launcher);
    }

    launcherHelper() {
        this.hideMenu(this.launcher.id);
    }

    resizeEventListener() {
        document.onresize = resize;
        document.onfullscreenchange = resize;

        const tasklistMaxWidth = () => {
            // Set tasklist maximum width to maximum available space between both ends of taskbar
            wmElements.get(this.taskbar.tasklistId).style.maxWidth = wmElements.bounds(this.taskbar.tasklistId).width;
        }
    
        function resize(e) {
            e = e || window.event;
            e.preventDefault();
            tasklistMaxWidth();
        }
    }

    menuClearEventListener() {
        wmElements.get('container').onmouseup = containerObserver;
        const callHideAllMenus = () => this.hideAllMenus();

        function containerObserver() {
            callHideAllMenus();
        }
    }

    runApp(applet) {
        if (applet instanceof wmApp) {
            applet.run();
        }
    }

    createWindow(customWindow) {
        var newWindow;
        if (customWindow === undefined) {
            newWindow = new wmWindow("Hello World", "Lorem ipsum");
        } else if (customWindow instanceof wmWindow) {
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
            //TODO: Stop all windows from refreshing content when new window created!

            // Make all windows draggable
            var allKeys = this.windowReg.keys();
            for (const key of allKeys) {
                this.moveWindow(wmElements.get(key));
            }

            // Use auto dimensions as default dimensions
            if (newWindow.allowResizable) {
                var newWindowEntity = wmElements.get(newWindow.id);
                newWindowEntity.style.minWidth = wmElements.bounds(newWindow.id).width;
                newWindowEntity.style.minHeight = wmElements.bounds(newWindow.id).height;
            }
        }
        addWindowToRegistry().then(() => {
            addWindowToSession().then(() => {
                updateSession().then(() => {
                    this.raiseWindow(newWindow.id);
                });
            });
        });
    }

    createMenu(newMenu) {
        if (newMenu instanceof wmMenu) {
            let addMenuToRegistry = async () => {
                this.menuReg.set(newMenu.id, newMenu);
            }
            let addMenuToSession = async () => {
                wmElements.draw('container', newMenu.render());
                wmElements.get(newMenu.id).style.visibility = 'collapse';
                wmElements.get(newMenu.id).style.display = 'none';
            }
            addMenuToRegistry().then(() => {
                addMenuToSession().then(() => {
                    for (const [key, value] of Object.entries(newMenu.subMenus)) {
                        this.createMenu(value);
                    }
                });
            });
        }
    }

    destroyWindow(windowId) {
        wmElements.destroy(windowId);
        wmElements.destroy(`tasklist-${windowId}`);
        wmElements.destroy(`taskman-item-${windowId}`);
        this.windowReg.delete(windowId);
    }

    destroyMenu(menuId) {
        wmElements.destroy(menuId);
        this.menuReg.delete(menuId);
    }

    toggleTasklistItem(windowId) {
        const thisWindow = this.windowReg.get(windowId);
        if (thisWindow.hidden === false && thisWindow.focused === true) {
            this.hideWindow(windowId);
        } else {
            this.raiseWindowHelper(windowId);
        }
    }

    hideWindow(windowId) {
        var windowMain = wmElements.get(windowId);
        var tasklistItem = wmElements.get(`tasklist-${windowId}`);

        if (windowMain.style.visibility === 'visible') {
            // Hide window
            windowMain.style.visibility = 'collapse';
            windowMain.style.display = 'none';
            // Embossed tasklist button
            tasklistItem.style.borderBottom = globals.DARK_BORDER();
            tasklistItem.style.borderRight = globals.DARK_BORDER();
            tasklistItem.style.borderTop= globals.LIGHT_BORDER();
            tasklistItem.style.borderLeft = globals.LIGHT_BORDER();
            // Update registry
            var windowEntry = this.windowReg.get(windowId);
            windowEntry.hidden = true;
            this.windowReg.set(windowId, windowEntry);
        } else {
            // Show window
            windowMain.style.visibility = 'visible';
            windowMain.style.display = 'flex';
            // Engraved tasklist button
            tasklistItem.style.borderBottom = globals.LIGHT_BORDER();
            tasklistItem.style.borderRight = globals.LIGHT_BORDER();
            tasklistItem.style.borderTop = globals.DARK_BORDER();
            tasklistItem.style.borderLeft = globals.DARK_BORDER();
            // Update registry
            var windowEntry = this.windowReg.get(windowId);
            windowEntry.hidden = false;
            this.windowReg.set(windowId, windowEntry);
        }
    }

    hideMenu(menuId, xPos=null, yPos=null) {
        var menu = wmElements.get(menuId);

        if (menu.style.visibility === 'visible') {
            // Hide menu
            menu.style.visibility = 'collapse';
            menu.style.display = 'none';
            // Update registry
            var menuEntry = this.menuReg.get(menuId);
            menuEntry.hidden = true;
            this.menuReg.set(menuId, menuEntry);
        } else {
            // Show menu
            menu.style.visibility = 'visible';
            menu.style.display = 'flex';
            // Position menu under pointer
            menu.style.top = xPos ? xPos : window.event.clientX;
            menu.style.left = yPos ? yPos : window.event.clientY;
            // Update registry
            var menuEntry = this.menuReg.get(menuId);
            menuEntry.hidden = false;
            this.menuReg.set(menuId, menuEntry);

            // Set hiding options
            wmElements.get(menu.id).onmousedown = menuObserver;

            const callHideMenu = () => this.hideMenu(menu.id);

            function menuObserver() {
                document.onmouseup = closeMenu;
            }
        
            function closeMenu() {
                document.onmousedown = null;
                callHideMenu();
            }
        }
    }

    hideAllMenus() {
        for (const menuId of this.menuReg.keys()) {
            const menu = wmElements.get(menuId);
            // Hide menu
            menu.style.visibility = 'collapse';
            menu.style.display = 'none';
            // Update registry
            var menuEntry = this.menuReg.get(menuId);
            menuEntry.hidden = true;
            this.menuReg.set(menuId, menuEntry);
        }
    }

    zoomWindow(windowId) {
        if (this.windowReg.has(windowId) && this.windowReg.get(windowId).allowResizable) {
            var windowMain = wmElements.get(windowId);
            
            if (this.windowReg.zoomed) {
                // restore to default dimensions
                windowMain.style.width = windowMain.style.minWidth;
                windowMain.style.height = windowMain.style.minHeight;
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
        windowMain.style.zIndex = globals.LEVEL_FOCUSED();
        wmElements.get(windowId + '-header').style.background = globals.WINDOW_HEADER_BG_COLOR_FOCUSED();

        // Show window
        windowMain.style.visibility = 'visible';
        windowMain.style.display = 'flex';

        // Engraved tasklist button
        tasklistItem.style.borderBottom = globals.LIGHT_BORDER();
        tasklistItem.style.borderRight = globals.LIGHT_BORDER();
        tasklistItem.style.borderTop = globals.DARK_BORDER();
        tasklistItem.style.borderLeft = globals.DARK_BORDER();

        // Update registry
        var windowEntry = this.windowReg.get(windowId);
        windowEntry.focused = true;
        this.windowReg.set(windowId, windowEntry);
    }

    styleWindowUnfocus(windowId) {
        const windowMain = wmElements.get(windowId);
        const tasklistItem = wmElements.get(`tasklist-${windowId}`);

        // Lower window and unfocus
        windowMain.style.zIndex = globals.LEVEL_UNFOCUSED();
        wmElements.get(windowId + '-header').style.background = globals.WINDOW_HEADER_BG_COLOR_UNFOCUSED();

        // Embossed tasklist button
        tasklistItem.style.borderBottom = globals.DARK_BORDER();
        tasklistItem.style.borderRight = globals.DARK_BORDER();
        tasklistItem.style.borderTop = globals.LIGHT_BORDER();
        tasklistItem.style.borderLeft = globals.LIGHT_BORDER();

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
            if (elmnt.style.width < elmnt.style.minWidth) {
                elmnt.style.width = elmnt.style.minWidth;
            }
            if (elmnt.style.height < elmnt.style.minHeight) {
                elmnt.style.height = elmnt.style.minHeight;
            }
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    moveWindow(windowEntity) {
        this.dragWindow(windowEntity);
        this.resizeWindow(windowEntity);
    }
}
