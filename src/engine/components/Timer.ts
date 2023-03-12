export default class Timer {
    duration: number = 0;
    time: number = 0;
    
    active: boolean = false;
    reversed: boolean = false;
    paused: boolean = false;
    justFinished: boolean = false;
    
    constructor(duration: number=1) {
        this.duration = duration;
    }

    start(duration?: number) {
        if (duration !== undefined)
            this.duration = duration;

        this.time = 0;
        if (this.reversed)
            this.time = this.duration;

        this.active = true;
    }
    stop() {
        this.active = false;
        this.time = 0;
        if (this.reversed)
            this.time = this.duration;
    }
    pause() {
        this.paused = true;
    }
    resume() {
        this.paused = false;
    }
    update() {
        if (this.active && !this.paused) {
            if (!this.reversed) {
                this.time ++;

                if (this.time >= this.duration) {
                    this.active = false;
                    this.justFinished = true;
                }
            } else {
                this.time --;

                if (this.time <= 0) {
                    this.active = false;
                    this.justFinished = true;
                }
            }
        }
    }
    updateJust() {
        this.justFinished = false;
    }

    // Get
    get finished(): boolean {
        return !this.active;
    }
    get progress(): number {
        return this.time / this.duration;
    }
}