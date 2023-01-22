export default class Timer {
    duration: number = 0;
    time: number = 0;

    active: boolean = false;
    justFinished: boolean = false;
    
    constructor(duration: number=1) {
        this.duration = duration;
    }

    start(duration?: number) {
        if (duration !== undefined)
            this.duration = duration;
        this.time = 0;
        this.active = true;
    }
    update() {
        if (this.active) {
            this.time ++;

            if (this.time >= this.duration) {
                this.active = false;
                this.justFinished = true;
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