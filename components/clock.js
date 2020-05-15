class Clock extends wmApp {
    constructor() {
        super("wmClock", "wmClock");
        this.today = new Date();
        this.h = this.today.getHours();
        this.m = this.today.getMinutes();
        this.s = this.today.getSeconds();
        this.timestamp = 'wmClock';

        this.taskbarApplet = new wmTaskbarTrayItem('trayclock');
    }

    run() {
        currentSession.taskbarTray.addItem(this.taskbarApplet);
        document.onload = this.startTime();
    }

    startTime() {
        this.h = this.today.getHours();
        this.m = this.today.getMinutes();
        this.s = this.today.getSeconds();
        this.m = this.checkTime(this.m);
        this.s = this.checkTime(this.s);
        this.timestamp = this.h + ":" + this.m + ":" + this.s;
        this.taskbarApplet.setLabel(this.timestamp);
        var t = setTimeout(this.startTime(), 500);
    }

    checkTime(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }
}