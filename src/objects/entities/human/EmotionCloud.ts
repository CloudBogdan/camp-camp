import { Engine, Sprite } from "../../../engine";
import { Assets } from "../../../engine/core/Assets";

export type Emotion = "happy" | "angry" | "sad" | "tired" | "food";

export default class EmotionCloud extends Sprite {
    human: Human;
    
    emotion: Emotion = "happy";
    hideTimer = Engine.createTimer(180);
    
    constructor(human: Human) {
        super("happy-emotion")
        
        this.human = human;
        this.visible = false;
        
        this.animation.frames = [0, 1];
        this.animation.speed = 30;
    }

    set(emotion: Emotion) {
        this.emotion = emotion;
        this.visible = true;
        this.hideTimer.start();

        this.image = Assets.getImage(this.emotion + "-emotion");
    }

    //
    update() {
        super.update();
        
        if (this.hideTimer.justFinished)
            this.visible = false;

        this.x = Math.floor(this.human.x) + 1;
        this.y = Math.floor(this.human.y) - 2 - 8;
    }
    destroy(): void {
        super.destroy();

        Engine.destroyTimer(this.hideTimer);
    }
}