import { Particle } from "../../managers/particles/Particle";


export default class OrderParticle extends Particle {
    constructor() {
        super("order-particle", 0);

        this.width = 16;
        this.height = 16;
        this.frame.width = 16;
        this.frame.height = 16;

        this.offset.x = 4;
        this.offset.y = 8;

        this.animation.frames = [0, 0, 1, 2, 3, 4, 5, 5];
        this.animation.speed = 4;
        this.animation.looped = false;
    }
}