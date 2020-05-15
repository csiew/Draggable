class WebBrowser extends wmApp {
    constructor() {
        super("Web Browser");

        this.homeUrl = "https://www.google.com/";
    }

    run() {
        var content = "<div class='taskman'><ul>";
        content += `
            <form action="javascript(console.log(browserUrl))">
                <input type="text" id="browserUrl" name="browserUrl" value="${this.homeUrl}&output=embed">
                <button type="submit">Load</button>
            </form>
            <iframe width="800" height="600" src="${this.homeUrl}&output=embed" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" frameborder="0"></iframe>
        `;
        content += "</ul></div>";
        var browserWindow = new wmWindow(this.name, content);
        currentSession.createWindow(browserWindow);
    }
}