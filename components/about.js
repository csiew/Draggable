class About extends wmApp {
    constructor() {
        super('About', 'about');

        this.wmName = "Hoddle";
        this.wmVersion = "0.1";
        this.wmDescription = "A JavaScript window manager and toolkit.";
        this.wmCopyright = "&copy; 2020, Clarence Siew. All rights reserved.";
    }

    run() {
        var content = "<div class='taskman'><ul style='text-align: center;'>";
        content += `
            <h1>${this.wmName}</h1>
            <p>
                Version ${this.wmVersion}<br />
                <small>${this.wmDescription}</small>
            </p>
            <p><small>${this.wmCopyright}</small></p>
        `;
        content += "</ul></div>";
        var browserWindow = new wmWindow(this.name, content, false);
        currentSession.createWindow(browserWindow);
    }
}