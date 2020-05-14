class Launcher extends wmMenu {
    constructor() {
        super('launcher', null, null, true);

        // Define submenus first!
        var prefSubmenu = new wmMenu(null, this.id);
        prefSubmenu.addItems([
            new wmMenuItem("Background", "prefs.setBackgroundWindow()"),
        ])
        super.addSubMenus([
            prefSubmenu,
        ])

        super.addItems([
            new wmMenuItem("Preferences", `currentSession.hideMenu('${prefSubmenu.id}')`, prefSubmenu.id),
            new wmMenuItem("Task Manager", "taskmgr.run()"),
            new wmMenuItem("Pool Manager", "pool.poolman()"),
            new wmMenuItem("New Sample Window", "currentSession.createWindow()"),
        ]);
    }
}