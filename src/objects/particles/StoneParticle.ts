import { Random } from "../../engine";
import { Particle } from "../../managers/particles/Particle";

export default class StoneParticle extends Particle {
    constructor() {
        super("stone-particle", 0);

        this.animation.paused = true;
        
        this.velocity.x = Random.float(-2, 2);
        this.velocity.y = Random.float(-2, 2);
        this.velocityMultiplier.x = .88;
        this.velocityMultiplier.y = .88;

        this.flipX = this.velocity.x < 0;
        
        this.scaleDownSpeed = .01;
    }
}