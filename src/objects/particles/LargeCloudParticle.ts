import { Random } from "../../engine";
import { Particle } from "../../managers/particles/Particle";

export default class LargeCloudParticle extends Particle {
    constructor() {
        super("cloud-particle");

        this.animation.frames = [0, 1, 2, 3, 4];
        this.animation.speed = Random.int(20, 30);

        this.velocity.x = Random.float(-1.5, 1.5);
        this.velocity.y = Random.float(-1.5, 1.5);
        this.velocityMultiplier.x = .95;
        this.velocityMultiplier.y = .95;
    }
}