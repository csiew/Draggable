class PoolManager {
    constructor() {
        this.pool = new Object();
    }

    add(title, content) {
        const newWindow = new wmWindow(title, content);
        this.pool[newWindow.id] = newWindow;
    }

    batchAdd(batchArray) {
        for (const [title, content] of batchArray) {
            this.add(title, content);
        }
    }

    run(windowId) {
        currentSession.createWindow(this.pool[windowId]);
    }

    runAll() {
        for (const item of Object.values(this.pool)) {
            currentSession.createWindow(item);
        }
    }

    poolman() {
        var allItems = "<div class='taskman'><ul>";
        for (const [key, value] of Object.entries(this.pool)) {
            allItems += `
                <li>
                    <div>${value.title}</div>
                    <button onclick="pool.run('${key}')">Run</button>
                </li>
            `
        }
        allItems += `<button onclick="pool.runAll()">Run All</button></ul></div>`
        var poolman = new wmWindow("Pool Manager", allItems, false);
        currentSession.createWindow(poolman);
    }
}