import { Random } from "../../engine";
import { Particle } from "../../managers/particles/Particle";

export default class FireParticle extends Particle {
    constructor() {
        super("fire-particle", 0);

        this.animation.frames = [0, 0, 0, 1, 2, 3, 4];
        this.animation.speed = 20;
        this.animation.looped = false;

        this.acceleration.x = Random.float(.01, .02);
        this.acceleration.y = Random.float(-.01, -.02);
    }
}