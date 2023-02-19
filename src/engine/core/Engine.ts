import Utils from "../../utils/Utils";
import { Stage } from "../components/Stage";
import Timer from "../components/Timer";
import { Assets } from "./Assets";
import { Keyboard } from "./Keyboard";
import { Renderer } from "./Renderer";

interface IEngineClock {
    time: number
    fps: number
    delta: number
}

export class Engine {
    static started: boolean = false;
    static isDebug: boolean = false;

    static focusedMenu: Menu | null = null;
    static currentStage: typeof Stage; 
    static clock: IEngineClock = {
        time: 0,
        fps: 60,
        delta: 0
    };
    
    static timers: Timer[] = [];
    
    static prestart: ()=> void = ()=> {};
    static start: ()=> void = ()=> {};
    static update: ()=> void = ()=> {};
    static draw: ()=> void = ()=> {};

    //
    private static _prestart() {
        this.prestart();
        
        if (this.currentStage)
            this.currentStage.prestart();
    }
    private static _start() {
        this.started = true;

        this.start();
        
        if (this.currentStage)
            this.currentStage.start();
    }
    private static _update() {
        for (const timer of this.timers) {
            timer.update();
        }

        this.update();
        
        if (this.currentStage)
            this.currentStage.update();
    }
    private static _draw() {
        this.draw();
        
        if (this.currentStage)
            this.currentStage.draw();
    }

    static init() {
        Assets.init();
        Renderer.init();
        Keyboard.init();

        console.log("%cSource code is here! :D\nhttps://github.com/CloudBogdan/little-colony", "color: orange; font-size: 18px");

        this._prestart()

        Assets.onLoaded.listen(()=> {
            this._start();
        })

        let lastTime = Date.now();
        const loop = ()=> {
            requestAnimationFrame(loop);
            
            if (this.started) {
                this.clock.time ++;
                
                // Update
                this._update();
                
                // Draw
                this._draw();

                for (const timer of this.timers) {
                    timer.updateJust();
                }
            }

            const nowTime = Date.now();
            this.clock.delta = nowTime - lastTime;
            this.clock.fps = 1000 / this.clock.delta;
            lastTime = Date.now();

            Keyboard.updateJust();
        };
        loop();

        if (Assets.totalAssets == 0) {
            Assets.onLoaded.notify(true);
            console.log("Loaded without assets");
        }

        //
        addEventListener("blur", ()=> {
            Keyboard.isPressed = false;
            Keyboard.justPressed = false;
            Keyboard.pressedKeys = {};
        });
    }

    //
    static gotoStage(stage: typeof Stage): typeof Stage {
        this.currentStage = stage;
        return stage;
    }

    static createTimer(duration?: number): Timer {
        const timer = new Timer(duration);
        
        this.timers.push(timer);
        return timer;
    }
    static destroyTimer(timer: Timer): Timer | null {
        const removedTimer = Utils.removeItem(this.timers, timer);
        return removedTimer;
    }

    //
    static every(frames: number): boolean {
        return this.time % frames == 0;
    }

    // Get
    static get width(): number {
        return Renderer.width;
    }
    static get height(): number {
        return Renderer.height;
    }
    static get time(): number {
        return this.clock.time;
    }
}