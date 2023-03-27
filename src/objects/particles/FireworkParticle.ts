import { Random } from "../../engine";
import { Particle } from "../../managers/particles/Particle";

export default class FireworkParticle extends Particle {
    constructor(index: number) {
        super("firework-particle", index);

        this.frame.y = Random.item([0, 8, 16, 24]);
        this.animation.speed = 40;
        this.animation.frames = [0, 1, 2, 3, 4];
        this.animation.looped = false;
        this.animation.paused

        this.velocity.x += Random.float(-2, 2);
        this.velocity.y += Random.float(-2, 2);
        // this.rotateSpeed = .5
        this.scaleDownSpeed = .01
        this.velocityMultiplier.x = .97;
        this.velocityMultiplier.y = .97;
    }
}