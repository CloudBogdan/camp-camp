import anime from "animejs";
import { Sprite } from "../engine";

export default class Animations {
    static treeFall(sprite: Sprite, complete: ()=> void=()=> {}) {
        sprite.playTween(anime({
            targets: sprite,
            angle: 90,
            duration: 1000,
            easing: "easeOutBounce",
            complete: ()=> {
                this.scaleDown(sprite, complete);
            },
            update: (tween)=> {
                if (!tween.paused) return;
                sprite.angle = 90;
            }
        }))
    }
    static scaleDown(sprite: Sprite, complete: ()=> void=()=> {}) {
        sprite.playTween(anime({
            targets: sprite,
            scaleX: 0,
            scaleY: 0,
            easing: "easeInCubic",
            duration: 500,
            complete: ()=> {
                complete();
            },
            update: (tween)=> {
                if (!tween.paused) return;
                sprite.scaleX = 0;
                sprite.scaleY = 0;
            }
        }))
    }
    static shaking(sprite: Sprite, complete: ()=> void=()=> {}) {
        sprite.playTween(anime({
            targets: sprite,
            angle: [-16, 16, -8, 0],
            easing: "easeInOutCubic",
            duration: 1000,
            complete: ()=> {
                complete();
            },
            update: (tween)=> {
                if (!tween.paused) return;
                sprite.angle = 0;
            }
        }))
    }
}