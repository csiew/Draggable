class Launcher extends wmMenu {
    constructor() {
        super('launcher', null, null, true);
        super.addItems([
            new wmMenuItem("Task Manager", "taskmgr.run()"),
            new wmMenuItem("Pool Manager", "pool.poolman()"),
            new wmMenuItem("New Sample Window", "currentSession.createWindow()"),
        ]);
    }
}