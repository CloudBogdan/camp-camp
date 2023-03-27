import { Random } from "../../engine";
import { Particle } from "../../managers/particles/Particle";

export default class CloudParticle extends Particle {
    constructor() {
        super("cloud-particle");

        this.animation.frames = [1, 2, 3, 4];
        this.animation.speed = Random.int(10, 20);

        this.velocity.x = Random.float(-1.2, 1.2);
        this.velocity.y = Random.float(-1.2, 1.2);
        this.velocityMultiplier.x = .95;
        this.velocityMultiplier.y = .95;
    }
}