import { FontColor, Renderer, TextAlign } from "../core/Renderer";
import { Object } from "./Object";

export default class Text extends Object {
    text: string;
    color: FontColor;
    align: TextAlign;

    scaleX: number = 1;
    scaleY: number = 1;
    
    constructor(name: string, text: string="", color: FontColor="white", align: TextAlign="left") {
        super(name);

        this.text = text;
        this.color = color;
        this.align = align;
    }

    draw(): void {
        super.draw();

        Renderer.save();

        Renderer.translate(this.x, this.y);
        Renderer.context.scale(this.scaleX, this.scaleY);
        
        Renderer.text(this.text, 0, 0, this.color, this.align);

        Renderer.restore();
    }
}