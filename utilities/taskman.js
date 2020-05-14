class TaskManager {
    run() {
        if (!wmElements.get("taskman")) {
            var allTasks = `
                <div class='taskman'>
                    <ul id='taskman-entries'>
                        <button onclick="taskmgr.purge()">Purge</button>
            `
            for (const [key, value] of currentSession.windowReg) {
                allTasks += this.createEntry(key, value.title);
            }
            allTasks += `</ul></div>`
            var taskman = new wmWindow("Task Manager", allTasks, false, "taskman");
            currentSession.createWindow(taskman);
        }
    }

    createEntry(key, title) {
        return `
            <li id="taskman-item-${key}">
                <div>${title}</div>
                <button onclick="currentSession.destroyWindow('${key}')">Kill</button>
            </li>
        `;
    }

    add(key, title) {
        if (wmElements.get("taskman") && key !== "taskman") {
            wmElements.get("taskman-entries").innerHTML += this.createEntry(key, title);
        }
    }

    purge() {
        for (const key of currentSession.windowReg.keys()) {
            if (key !== "taskman") {
                currentSession.destroyWindow(key);
            }
        }
    }
}