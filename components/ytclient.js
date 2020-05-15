class YouTubeClient extends wmApp {
    constructor() {
        super("YouTube Client");
        this.appWindow = null;
    }

    run() {
        var content = "<div class='taskman'>";
        content += `
            <ul>
                <li>
                    <button type="submit" onclick="ytClient.clear()">Clear</button>
                    <input
                        type="text"
                        id="ytClientVideoUrl"
                        placeholder="Enter a YouTube video URL"
                        onclick="ytClient.focusUrlBar()"
                        style="width: 100%;"
                    >
                    </input>
                    <button type="submit" onclick="ytClient.setUrl(wmElements.get('ytClientVideoUrl').value)">Watch</button>
                </li>
            </ul>
            </div>
            <div id="ytClientVideoUrlVideoframe" style="position: relative; align-self: stretch; justify-self: stretch; width: inherit; height: inherit;"></div>
        `;
        this.appWindow = new wmWindow(this.name, content);
        currentSession.createWindow(this.appWindow);
    }

    setUrl(videoUrl) {
        const newUrl = videoUrl.replace('https://www.youtube.com/watch?v=','https://www.youtube.com/embed/');
        const videoFrame = wmElements.get('ytClientVideoUrlVideoframe');
        const setVideoFrameSize = async () => {
            videoFrame.style.width = '480px';
            videoFrame.style.height = '360px';
            videoFrame.innerHTML = `
                <iframe style="position: absolute; align-self: stretch; justify-self: stretch; width: 100%; height: 100%;" src="${newUrl}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" frameborder="0"></iframe>
            `;
        }
        setVideoFrameSize().then(() => {
            const windowElement = wmElements.get(this.appWindow.id);
            windowElement.style.minWidth = wmElements.bounds(this.appWindow.id).width;
            windowElement.style.minHeight = wmElements.bounds(this.appWindow.id).height;
        });
    }

    clear() {
        const videoFrame = wmElements.get('ytClientVideoUrlVideoframe');
        const setVideoFrameSize = async () => {
            videoFrame.innerHTML = '';
            videoFrame.style.width = '0px';
            videoFrame.style.height = '0px';
        }
        setVideoFrameSize().then(() => {
            const windowElement = wmElements.get(this.appWindow.id);
            windowElement.style.minWidth = globals.DEFAULT_WIDTH();
            windowElement.style.minHeight = globals.DEFAULT_HEIGHT();
            windowElement.style.width = globals.DEFAULT_WIDTH();
            windowElement.style.height = globals.DEFAULT_HEIGHT();
        });
    }
    
    focusUrlBar() {
        wmElements.get('ytClientVideoUrl').focus();
    }
}