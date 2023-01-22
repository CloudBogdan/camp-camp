import { Group, Sprite } from "../engine";

export class Particle extends Sprite {
    scaleDownSpeed: number = 0;
    rotateSpeed: number = 0;
    group!: Group<Particle>;
    
    constructor(name: string) {
        super(name)

        this.offset.x = 4;
        this.offset.y = 4;
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

export default class Particles {
    static particlesGroup = new Group<Particle>();

    static addParticles(particleCallback: ()=> Particle, xCallback: ()=> number, yCallback: ()=> number, count: number=1) {
        for (let i = 0; i < count; i ++) {
            const particle = particleCallback();
            
            particle.x = xCallback();
            particle.y = yCallback();
            particle.group = this.particlesGroup;

            this.particlesGroup.add(particle);
        }
    }
    
    //
    static update() {
        this.particlesGroup.update();
    }
    static draw() {
        this.particlesGroup.draw();
    }
}