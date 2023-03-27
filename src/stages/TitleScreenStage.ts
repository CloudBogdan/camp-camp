import anime from "animejs";
import { Engine, Keyboard, Renderer, Sprite, Stage } from "../engine";
import Text from "../engine/components/Text";
import GameStage from "../GameStage";
import Palette from "../utils/Palette";
import Utils from "../utils/Utils";

export default class TitleScreenStage extends Stage {
    logoSprite: Sprite | null = null;
    bogdanovSprite: Sprite | null = null;

    startedTimer = Engine.createTimer(60);
    
    start(): void {
        super.start();

        //
        this.bogdanovSprite = new Sprite("bogdanov", 64, 64);
        
        this.bogdanovSprite.origin.x = 32;
        this.bogdanovSprite.origin.y = 32;
        this.bogdanovSprite.scaleX = 0;
        this.bogdanovSprite.scaleY = 0;
        this.bogdanovSprite.y = 32;
        
        //
        this.logoSprite = new Sprite("logo", 64, 64);
        
        this.logoSprite.animation.looped = true;
        this.logoSprite.animation.speed = 10;
        this.logoSprite.animation.paused = false;
        this.logoSprite.animation.frames = [0, 1, 2, 3, 4, 5, 6, 7];

        this.logoSprite.scaleX = 0;
        this.logoSprite.scaleY = 0;

        //
        anime({
            targets: this.bogdanovSprite,
            scaleX: [0, 1],
            scaleY: [0, 1],
            delay: 1000,
            easing: "easeOutCirc",
            duration: 300,
            complete: ()=> {

                anime({
                    targets: this.bogdanovSprite,
                    y: -Engine.height,
                    easing: "easeInOutCubic",
                    delay: 2000,
                    duration: 2000,
                    complete: ()=> {
                        this.logoSprite!.playTween(anime({
                            targets: this.logoSprite,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 600,
                            easing: "easeOutBack",
                            delay: 200
                        }))
                    }
                })
                
            },
        })
    }

    update(): void {
        super.update();
        
        if (this.logoSprite && this.bogdanovSprite) {
            this.logoSprite.y = this.bogdanovSprite.y + Engine.height + 24;
            
            this.logoSprite.update();
        }
        if (this.bogdanovSprite) {
            this.bogdanovSprite.x = Engine.width/2 - 32;
            
            this.bogdanovSprite.update();
        }
        
        if (Keyboard.justPressed && this.logoSprite?.tween?.completed && !this.startedTimer.active && !Engine.isTransBetweenStages) {
            this.startedTimer.start();
        }

        if (this.startedTimer.justFinished) {
            Engine.transitionToStage(GameStage)
        }
    }
    
    draw(): void {
        super.draw();
        if (!this.bogdanovSprite || !this.logoSprite) return;

        Renderer.rect(0, 24 + 32 - 8 + Math.floor((this.bogdanovSprite.y + Engine.height)/1.5), Engine.width, 16, Palette.GROUND);
        Renderer.rect(0, 24 + 32 + 9 + Math.floor((this.bogdanovSprite.y + Engine.height)/1.5), Engine.width, 2, Palette.GROUND);
        Renderer.rect(0, 24 + 32 + 12 + Math.floor((this.bogdanovSprite.y + Engine.height)/1.5), Engine.width, 1, Palette.GROUND);
        
        const startTextX = Math.floor(Engine.width/2);
        const startTextY = Engine.height-24;

        //
        this.logoSprite.x = Math.floor(Engine.width/2 - this.logoSprite.width/2);
        this.logoSprite.offset.y = (Math.sin(this.logoSprite.time / 100) * 4);
        this.logoSprite.draw();

        const isTrans = !((this.startedTimer.active ? (this.logoSprite.time % 10 > 5) : (this.logoSprite.time % 60 > 30)) && this.logoSprite?.tween?.completed);

        Renderer.text("старт!", startTextX, startTextY, isTrans ? "transparent" : "white", "center");

        const progress = Utils.clamp(Math.pow(this.startedTimer.progress / .3, 1/4), 0, 1)
        const rectWidth = Math.floor(progress * 128);
        const rectHeight = Math.floor((1 - progress) * 16);
        Renderer.rect(startTextX - Math.floor(rectWidth/2), startTextY + 3 - Math.floor(rectHeight/2), rectWidth, rectHeight, Palette.WHITE);
        
        //
        this.bogdanovSprite.draw();

        Renderer.text("beta build 3", 0, 0, "dark-brown");
        
    }
}