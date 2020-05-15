currentSession = new wmSession();
currentSession.init();
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
browser = new WebBrowser();
about = new About();