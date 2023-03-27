import { Sprite, Group } from "../../engine";

export class Particle extends Sprite {
    scaleDownSpeed: number = 0;
    rotateSpeed: number = 0;
    group!: Group<Particle>;
    
    constructor(name: string, index?: number) {
        super(name)

        this.offset.x = this.width/2;
        this.offset.y = this.height/2;
        this.origin.x = this.width/2;
        this.origin.y = this.height/2;
        this.animation.looped = false;
    }

    update(): void {
        super.update();

        this.angle += this.rotateSpeed;
        this.scaleX -= this.scaleDownSpeed;
        this.scaleY -= this.scaleDownSpeed;

        if (this.animation.finished || this.scaleX <= 0 || this.scaleY <= 0)
            this.group.destroy(this);
    }
}