import { Random } from "../../engine";
import { Particle } from "../../managers/Particles";

export default class StoneParticle extends Particle {
    constructor() {
        super("stone-particle");

        this.velocity.x = Random.float(-.8, .8);
        this.velocity.y = -1.2;
        this.velocityMultiplier.x = 1;
        this.velocityMultiplier.y = 1;

        this.acceleration.y = .06;

        this.flipX = this.velocity.x < 0;
        
        this.scaleDownSpeed = .02;
        this.rotateSpeed = 2;
    }
}