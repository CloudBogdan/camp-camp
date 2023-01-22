import anime, { AnimeInstance } from "animejs";
import { Renderer } from "../engine";
import Config from "../utils/Config";
import Palette from "../utils/Palette";

export default class MenuButtonSelector {
    x: number = 0;
    y: number = 0;

    width: number = 56;
    height: number = Config.SPRITE_SIZE+1;

    tween: AnimeInstance | null = null;
    
    constructor() {
        
    }

    animateTo(x: number, y: number) {
        if (this.tween) {
            this.tween.pause();
            anime.remove(this);
            this.tween = null;
        }
        
        anime({
            targets: this,
            x: x,
            y: y,
            easing: "linear",
            duration: 60
        })
    }
    
    //
    update() {

    }
    draw() {
        Renderer.rect(
            this.x,
            this.y,
            this.width,
            this.height,
            Palette.WHITE
        );
    }
}