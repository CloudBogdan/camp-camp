import Config from "../../utils/Config";
import { IPoint } from "../../utils/types";
import { Assets } from "../core/Assets";
import { Renderer } from "../core/Renderer";
import { Trigger } from "../utils/Trigger";
import { Object } from "./Object";

class SpriteFrame {
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
}
class SpriteAnimation {
    paused: boolean = false;
    speed: number = 20;
    frames: number[] = [0];
    looped: boolean = true;
    finished: boolean = false;
    reversed: boolean = false;
    private lastFrameIndex: number = 0;
    private _frameIndex: number = 0;

    onFrameChanged = new Trigger<number>("sprite-animation/on-frame-changed");

    update(time: number) {
        if (!this.paused && time % this.speed == 0) {
            if (!this.reversed) {
                this.frameIndex ++;

                if (this.frameIndex >= this.frames.length && this.looped)
                    this.frameIndex = 0;
                if (this.frameIndex > this.frames.length && !this.looped)
                    this.finished = true;
            } else {
                this.frameIndex --;

                if (this.frameIndex < 0 && this.looped)
                    this.frameIndex = this.frames.length-1;
                if (this.frameIndex <= 0 && !this.looped)
                    this.finished = true;
            }
        }
    }
    
    //
    get frameIndex(): number {
        return this._frameIndex;
    }
    set frameIndex(value: number) {
        if (value != this.lastFrameIndex)
            this.onFrameChanged.notify(value);
            
        this.lastFrameIndex = this._frameIndex;
        this._frameIndex = value;
    }
}
export interface ISpriteIcon {
    name: string
    sliceX: number
    sliceY: number
    sliceWidth?: number
    sliceHeight?: number
}


export class Sprite extends Object {
    image: HTMLImageElement | null;
    
    frame = new SpriteFrame();
    animation = new SpriteAnimation();
    
    width: number;
    height: number;
    angle: number = 0;
    scaleX: number = 1;
    scaleY: number = 1;
    offset: IPoint = { x: 0, y: 0 };
    flipX: boolean = false;
    flipY: boolean = false;
    alpha: number = 1;
    
    constructor(name: string, width: number=Config.SPRITE_SIZE, height: number=Config.SPRITE_SIZE) {
        super(name);
        
        this.image = Assets.getImage(this.name);
        
        this.width = width;
        this.height = height;
        this.frame.width = this.width;
        this.frame.height = this.height;
    }

    update() {
        super.update();
    }
    updateAnimations() {
        this.animation.update(this.time);
    }
    draw() {
        super.draw();
        if (!this.visible) return;
        
        this.updateAnimations();
        
        Renderer.save();

        if (this.alpha != 1)
            Renderer.context.globalAlpha = this.alpha;
        
        Renderer.translate(this.width/2, this.height,)
        Renderer.translate(
            this.x - this.offset.x,
            this.y - this.offset.y
        );
        Renderer.context.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1));
        Renderer.context.rotate(this.angle * (Math.PI / 180));

        Renderer.sprite(
            this.image,
            -this.width/2, -this.height,
            this.frame.x + this.animation.frames[this.animation.frameIndex] * this.frame.width, this.frame.y,
            this.frame.width, this.frame.height
        );

        if (this.alpha != 1)
            Renderer.context.globalAlpha = 1;
            
        Renderer.restore();
    }

    //
    getCenter(): IPoint {
        return {
            x: this.x + Math.floor(this.width/2),
            y: this.y + Math.floor(this.height/2)
        }
    }
}