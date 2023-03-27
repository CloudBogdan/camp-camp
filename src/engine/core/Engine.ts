import Config from "../../utils/Config";
import Palette from "../../utils/Palette";
import Utils from "../../utils/Utils";
import { Group } from "../components/Group";
import { Sprite } from "../components/Sprite";
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
    static inited: boolean = false;
    static started: boolean = false;
    static isDebug: boolean = false;

    static nextStageClass: typeof Stage | null = null;
    static currentStage: Stage; 
    static focusedMenu: Menu | null = null;
    static clock: IEngineClock = {
        time: 0,
        fps: 60,
        delta: 0
    };
    
    static spritesGroup = new Group<Sprite>();
    static timers: Timer[] = [];
    
    static fadeOutStageTimer = this.createTimer(20);
    static fadeInStageTimer = this.createTimer(20);
    
    static prestart: ()=> void = ()=> {};

    //
    private static _prestart() {
        this.prestart();
    }
    private static _start() {
        this.started = true;

        this.fadeInStageTimer.reversed = true;
        
        if (this.currentStage && !this.currentStage.started)
            this.currentStage.start();
    }
    private static _update() {
        for (const timer of this.timers) {
            timer.update();
        }
        
        if (this.nextStageClass && this.fadeOutStageTimer.justFinished) {
            this.fadeInStageTimer.start();
            this.gotoStage(this.nextStageClass);
        }

        if (this.currentStage)
            this.currentStage.update();
        this.spritesGroup.update();
    }
    private static _draw() {
        Renderer.background(Palette.BLACK);
        
        if (this.currentStage)
            this.currentStage.draw();
        this.spritesGroup.draw();
        
        const rectSize = Math.floor(this.stageTransitionProgress * 16);

        if (rectSize >= 1) {
            for (let i = 0; i < Math.floor(this.width / 16); i ++) {
                for (let j = 0; j < Math.floor(this.height / 16); j ++) {
                    Renderer.rect(
                        i * 16 + 8 - Math.floor(rectSize/2),
                        j * 16 + 8 - Math.floor(rectSize/2),
                        rectSize, rectSize, Palette.BLACK
                    )
                }
            }
        }
    }

    static init() {
        Assets.init();
        Renderer.init();
        Keyboard.init();

        if (!Config.IS_DEV)
            console.log("%cSource code is here! :D\nhttps://github.com/CloudBogdan/camp-camp", "color: orange; font-size: 18px");

        this._prestart()

        this._start();

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

        this.inited = true;
    }

    //
    static gotoStage(stageClass: typeof Stage) {
        this.fadeOutStageTimer.stop();
        this.nextStageClass = null;
        
        if (this.currentStage) {
            this.currentStage.destroy();
        }
        
        const stage = new stageClass();
        
        this.currentStage = stage;
        if (this.inited && !this.currentStage.started) {
            this.currentStage.start();
            this.currentStage.started = true;
        }
        return stage;
    }
    static transitionToStage(stageClass: typeof Stage) {
        this.fadeOutStageTimer.start();
        this.nextStageClass = stageClass
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
    static get stageTransitionProgress(): number {
        return this.fadeOutStageTimer.progress + this.fadeInStageTimer.progress;
    }
    static get isTransBetweenStages(): boolean {
        return this.fadeOutStageTimer.active || this.fadeInStageTimer.active;
    }
}