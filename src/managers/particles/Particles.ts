import { Group, Sprite } from "../../engine";
import { Particle } from "./Particle";

export default class Particles {
    static particlesGroup = new Group<Particle>();

    static addParticles(particleCallback: (index: number)=> Particle, xCallback: ()=> number, yCallback: ()=> number, count: number=1) {
        for (let i = 0; i < count; i ++) {
            const particle = particleCallback(i);
            
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