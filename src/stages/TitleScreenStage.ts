import anime from "animejs";
import { Engine, Keyboard, Renderer, Sprite, Stage } from "../engine";
import GameStage from "../GameStage";
import Palette from "../utils/Palette";
import Utils from "../utils/Utils";

export default class TitleScreenStage extends Stage {
    logo: Sprite | null = null;

    startedTimer = Engine.createTimer(60);
    
    start(): void {
        super.start();

        this.logo = new Sprite("logo", 64, 64);
        
        this.logo.animation.looped = true;
        this.logo.animation.speed = 10;
        this.logo.animation.paused = false;
        this.logo.animation.frames = [0, 1, 2, 3, 4, 5, 6, 7];

        this.logo.scaleX = 0;
        this.logo.scaleY = 0;
        this.logo.playTween(anime({
            targets: this.logo,
            scaleX: 1,
            scaleY: 1,
            duration: 1400,
            delay: 1000
        }))
    }

    update(): void {
        super.update();

        if (this.logo) {
            this.logo.update();
        }
        
        if (Keyboard.justPressed && this.logo?.tween?.completed) {
            this.startedTimer.start();
        }

        if (this.startedTimer.justFinished) {
            Engine.transitionToStage(GameStage)
        }
    }
    
    draw(): void {
        super.draw();

        Renderer.rect(0, 24 + 32 - 8, Engine.width, 16, Palette.GROUND);
        Renderer.rect(0, 24 + 32 + 9, Engine.width, 2, Palette.GROUND);
        Renderer.rect(0, 24 + 32 + 12, Engine.width, 1, Palette.GROUND);
        
        const startTextX = Math.floor(Engine.width/2);
        const startTextY = Engine.height-24;
        
        if (this.logo) {
            this.logo.x = Math.floor(Engine.width/2 - this.logo.width/2);
            this.logo.y = 24 + (Math.sin(this.logo.time / 200) * 6);
            this.logo.draw();

            const isTrans = !((this.startedTimer.active ? (this.logo.time % 10 > 5) : (this.logo.time % 60 > 30)) && this.logo?.tween?.completed);

            Renderer.text("старт!", startTextX, startTextY, isTrans ? "transparent" : "white", "center");

            const progress = Utils.clamp(Math.pow(this.startedTimer.progress / .3, 1/4), 0, 1)
            const rectWidth = Math.floor(progress * 128);
            const rectHeight = Math.floor((1 - progress) * 16);
            Renderer.rect(startTextX - Math.floor(rectWidth/2), startTextY + 3 - Math.floor(rectHeight/2), rectWidth, rectHeight, Palette.WHITE);
        }


        Renderer.text("beta build 2", 0, 0, "dark-brown");
        
    }
}