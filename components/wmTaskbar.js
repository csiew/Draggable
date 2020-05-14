class wmTaskbar {
    constructor() {
        this.id = 'taskbar';
        this.leftBarId = 'taskbarLeft';
        this.tasklistId = 'taskbarTasklist';
        this.rightBarId = 'taskbarRight';

        this.leftItems = new Map();
        this.tasklistItems = new Map();
        this.rightItems = new Map();
    }

    render() {
        if (!wmElements.get(`${this.id}`)) {
            var taskbar = `
                <div class='taskbar' id='${this.id}'>
            `;
            var taskbarLeft = `<div class='taskbarList' id='${this.leftBarId}'>`;
            for (const [key, value] of this.leftItems) {
                taskbarLeft += value.render();
            }
            taskbarLeft += "</div>";

            var tasklist = `<div class='taskbarTasklist' id='${this.tasklistId}'>`;
            for (const [key, value] of this.tasklistItems) {
                tasklist += value.render();
            }
            tasklist += "</div>";

            var taskbarRight = `<div class='taskbarList' id='${this.rightBarId}'>`;
            for (const [key, value] of this.rightItems) {
                taskbarRight += value.render();
            }
            taskbarRight += "</div>";

            taskbar += taskbarLeft + tasklist + taskbarRight + '</div>';

            return taskbar;
        }
    }

    addLeft(newTaskbarItem) {
        if (newTaskbarItem instanceof wmTaskbarItem) {
            this.leftItems.set(newTaskbarItem.id, newTaskbarItem);
            wmElements.draw(this.leftBarId, newTaskbarItem.render());
        }
    }

    addLeftItems(items) {
        for (const item of items) {
            this.addLeft(item);
        }
    }

    addRight(newTaskbarItem) {
        if (newTaskbarItem instanceof wmTaskbarItem) {
            this.rightItems.set(newTaskbarItem.id, newTaskbarItem);
            wmElements.draw(this.rightBarId, newTaskbarItem.render());
        }
    }

    addRightItems(items) {
        for (const item of items) {
            this.addRight(item);
        }
    }

    addTask(newWindow) {
        const newTasklistItem = new wmTasklistItem(newWindow.id, newWindow.title);
        this.tasklistItems.set(newTasklistItem.id, newTasklistItem);
        wmElements.draw(this.tasklistId, newTasklistItem.render());
    }
}