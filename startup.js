var globals, currentSession, taskmgr, pool, prefs, browser, about, clock, ytClient;

// Initialisation
globals = new wmGlobals();
currentSession = new wmSession();
currentSession.init();
taskmgr = new TaskManager();
pool = new PoolManager();
prefs = new Preferences();
browser = new WebBrowser();
about = new About();
// clock = new Clock();
ytClient = new YouTubeClient();

// Autostart
// currentSession.runApp(clock);

// Additional startup activities
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
        '<iframe style="align-self: stretch; justify-self: stretch; width: inherit; height: inherit;" width="720" height="560" src="https://www.youtube.com/embed/NmN9gy0HvCo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    ]
]);