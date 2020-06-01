class Preferences {
    constructor() {
        this.preferences = new Object();
        this.backgrounds = new Object();

        this.backgrounds['color'] = new Object();
        this.backgrounds['img'] = new Object();

        var colors = {
            'Dark Slate Blue': 'darkslateblue',
            'Dark Cyan': 'darkcyan',
            'Steel Blue': 'steelblue'
        };
        var imgs = {
            'Abstract': './assets/Abstract.png',
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

    setBackgroundDefault() {
        document.body.style.background = 'steelblue';
        document.body.style.backgroundImage = `url(./assets/Abstract.png)`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundOrigin = 'center';
    }

    setBackgroundColor(bgColor) {
        if (bgColor !== '') {
            document.body.style.backgroundImage = 'none';
            document.body.style.background = bgColor;
        }
    }

    setBackgroundImg(imgUrl) {
        if (imgUrl !== '') {
            document.body.style.backgroundImage = `url(${imgUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundOrigin = 'center';
        }
    }

    setBackgroundFocusInputColor() {
        wmElements.get('prefsBackgroundCustomColor').focus();
    }

    setBackgroundFocusInputImg() {
        wmElements.get('prefsBackgroundCustomImg').focus();
    }

    setBackgroundFocusInputColorClear() {
        wmElements.get('prefsBackgroundCustomColor').value = '';
        wmElements.get('prefsBackgroundCustomColor').focus();
    }

    setBackgroundFocusInputImgClear() {
        wmElements.get('prefsBackgroundCustomColor').value = '';
        wmElements.get('prefsBackgroundCustomImg').focus();
    }

    setBackgroundWindow() {
        var content = "<div class='taskman'><ul>";
        content += `
            <li>
                <button onclick="prefs.setBackgroundDefault()">Default</button>
            </li>
        `;
        content += `
            <li>
                <h3>Colors</h3>
            </li>
        `;
        for (const [name, value] of Object.entries(this.backgrounds['color'])) {
            content += `
                <li>
                    <div>${name}</div>
                    <button onclick="prefs.setBackgroundColor('${value}')">Set</button>
                </li>
            `
        }
        content += `
            <li>
                <button type="submit" onclick="prefs.setBackgroundFocusInputColorClear()">&minus;</button>
                <input
                        type="text"
                        id="prefsBackgroundCustomColor"
                        placeholder="#008B8B"
                        onclick="prefs.setBackgroundFocusInputColor()"
                >
                </input>
                <button type="submit" onclick="prefs.setBackgroundColor(wmElements.get('prefsBackgroundCustomColor').value)">Set</button>
            </li>
        `;
        content += `
            <li>
                <h3>Images</h3>
            </li>
        `;
        for (const [name, value] of Object.entries(this.backgrounds['img'])) {
            content += `
                <li>
                    <div>${name}</div>
                    <button onclick="prefs.setBackgroundImg('${value}')">Set</button>
                </li>
            `
        }
        content += `
            <li>
                <button type="submit" onclick="prefs.setBackgroundFocusInputImgClear()">&minus;</button>
                <input
                    type="text"
                    id="prefsBackgroundCustomImg"
                    placeholder="https://images.unsplash.com/photo-1545159245-600763fadf07?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1328&q=80"
                    onclick="prefs.setBackgroundFocusInputImg()"
                >
                </input>
                <button type="submit" onclick="prefs.setBackgroundImg(wmElements.get('prefsBackgroundCustomImg').value)">Set</button>
            </li>
        `;
        var prefsBackground = new wmWindow("Background", content, false);
        currentSession.createWindow(prefsBackground);
    }
}