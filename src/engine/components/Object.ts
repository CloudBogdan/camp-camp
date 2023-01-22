import anime from "animejs";
import { IPoint } from "../../utils/types";
import Utils from "../../utils/Utils";
import { Basic } from "./Basic";

let objectId = 0;

export class Object extends Basic {
    id: number = objectId ++;
    name: string;
    time: number = 0;

    tween: anime.AnimeInstance | null = null;
    
    x: number = 0;
    y: number = 0;
    velocity: IPoint = { x: 0, y: 0 };
    acceleration: IPoint = { x: 0, y: 0 };
    velocityMultiplier: IPoint = { x: .9, y: .9 };
    visible: boolean = true;
    destroyed: boolean = false;
    
    constructor(name: string) {
        super();
        
        this.name = name;
    }

    update() {
        super.update();

        this.time ++;

        this.updateMovement();
    }
    updateMovement() {
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        
        this.velocity.x *= this.velocityMultiplier.x;
        this.velocity.y *= this.velocityMultiplier.y;
        this.x += this.velocity.x/4;
        this.y += this.velocity.y/4;
    }
    updateJust() {
        
    }
    
    draw() {
        super.draw();
    }
    destroy() {
        this.destroyed = true;
    }

    //
    stopTween() {
        if (this.tween) {
            // this.tween.stopped && this.tween.stopped();
            this.tween.pause();
        }
        this.tween = null;
    }
    playTween(tween: anime.AnimeInstance) {
        this.stopTween();
        this.tween = tween;
    }

    //
    distance(x: number, y: number, offsetX: number=0, offsetY: number=0): number {
        return Utils.distance(this.x - offsetX, this.y - offsetY, x, y);
    }
    
    //
    getListenerKey(): string {
        return `${ this.name }-${ this.id }`;
    }
}