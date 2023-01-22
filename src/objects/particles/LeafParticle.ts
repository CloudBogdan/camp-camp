import { Random } from "../../engine";
import { Particle } from "../../managers/Particles";

export default class LeafParticle extends Particle {
    constructor() {
        super("leaf-particle");

        this.acceleration.x = Random.float(-.04, .04);
        this.acceleration.y = Random.float(.01, .03);

        this.flipX = this.acceleration.x < 0;
        
        this.animation.speed = Random.int(30, 50);
        this.animation.looped = false;
        this.animation.frames = [0, 1, 2, 3];
    }
}