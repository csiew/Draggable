class WebBrowser extends wmApp {
    constructor() {
        super("Web Browser");
        this.appWindow = null;
    }

    run() {
        var content = "<div class='taskman'>";
        content += `
            <ul>
                <li>
                    <button type="submit" onclick="browser.clear()">Clear</button>
                    <input
                        type="text"
                        id="browserUrl"
                        placeholder="Enter a web address"
                        onclick="browser.focusUrlBar()"
                        style="width: 100%;"
                    >
                    </input>
                    <button type="submit" onclick="browser.setUrl(wmElements.get('browserUrl').value)">Go</button>
                </li>
            </ul>
            </div>
            <div id="browserUrlPageframe" style="position: relative; align-self: stretch; justify-self: stretch; width: inherit; height: inherit;"></div>
        `;
        this.appWindow = new wmWindow(this.name, content);
        currentSession.createWindow(this.appWindow);
    }

    setUrl(pageUrl) {
        const pageFrame = wmElements.get('browserUrlPageframe');
        const setPageFrameSize = async () => {
            pageFrame.style.width = '480px';
            pageFrame.style.height = '360px';
            pageFrame.innerHTML = `
                <iframe style="position: absolute; align-self: stretch; justify-self: stretch; width: 100%; height: 100%;" src="${pageUrl}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" frameborder="0"></iframe>
            `;
        }
        setPageFrameSize().then(() => {
            const windowElement = wmElements.get(this.appWindow.id);
            windowElement.style.minWidth = wmElements.bounds(this.appWindow.id).width;
            windowElement.style.minHeight = wmElements.bounds(this.appWindow.id).height;
        });
    }

    clear() {
        const pageFrame = wmElements.get('browserUrlPageframe');
        const setPageFrameSize = async () => {
            pageFrame.innerHTML = '';
            pageFrame.style.width = '0px';
            pageFrame.style.height = '0px';
        }
        setPageFrameSize().then(() => {
            const windowElement = wmElements.get(this.appWindow.id);
            windowElement.style.minWidth = globals.DEFAULT_WIDTH();
            windowElement.style.minHeight = globals.DEFAULT_HEIGHT();
            windowElement.style.width = globals.DEFAULT_WIDTH();
            windowElement.style.height = globals.DEFAULT_HEIGHT();
        });
    }
    
    focusUrlBar() {
        wmElements.get('browserUrl').focus();
    }
}