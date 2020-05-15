class wmElements {
    static draw(id, content) {
        document.getElementById(id).innerHTML += content;
    }

    static destroy(id) {
        if (document.getElementById(id)) {
            document.getElementById(id).remove();
        }
    }

    static bounds(id) {
        return document.getElementById(id).getBoundingClientRect();
    }

    static get(id) {
        return document.getElementById(id);
    }

    static getClass(className) {
        return document.getElementsByClassName(className);
    }

    static getStylePropValue(varName) {
        return getComputedStyle(document.body).getPropertyValue(varName);
    }
}