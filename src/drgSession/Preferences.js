import _ from '../resources/Resources.js';

class Preferences {
    constructor() {
        this.preferences = new Object();
        this.backgrounds = new Object();

        this.backgrounds['color'] = new Object();
        this.backgrounds['img'] = new Object();

        var colors = {
            'Tomato': 'tomato',
            'Dark Cyan': 'darkcyan',
            'Steel Blue': 'steelblue'
        };
        var imgs = {
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

    setBackgroundColor(bgColor) {
        document.body.style.backgroundImage = 'none';
        document.body.style.background = bgColor;
    }

    setBackgroundImg(imgUrl) {
        document.body.style.backgroundImage = `url(${imgUrl})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundOrigin = 'center';
    }

    setBackgroundWindow() {
        var allItems = "<div class='taskman'><ul>";
        allItems += `
            <li>
                <h3>Colors</h3>
            </li>
        `;
        for (const [name, value] of Object.entries(this.backgrounds['color'])) {
            allItems += `
                <li>
                    <div>${name}</div>
                    <button onclick="prefs.setBackgroundColor('${value}')">Set</button>
                </li>
            `
        }
        allItems += `
            <li>
                <h3>Images</h3>
            </li>
        `;
        for (const [name, value] of Object.entries(this.backgrounds['img'])) {
            allItems += `
                <li>
                    <div>${name}</div>
                    <button onclick="prefs.setBackgroundImg('${value}')">Set</button>
                </li>
            `
        }
        var prefsBackground = new wmWindow("Background", allItems, false);
        currentSession.createWindow(prefsBackground);
    }
}

export default Preferences;