import { Engine } from "../engine";
import Config from "../utils/Config";

export default class Screen {
    static x: number = 0;
    static y: number = 0;
    static width: number = Config.WORLD_SIZE * Config.SPRITE_SIZE;
    static height: number = Config.WORLD_SIZE * Config.SPRITE_SIZE;

    static update() {
        this.x = Engine.width/2 - this.width/2 - Config.WORLD_OFFSET_X;
        this.y = Engine.height/2 - this.height/2 - Config.WORLD_OFFSET_Y;
    }

    //
    static inBounds(x: number, y: number): boolean {
        return (
            x >= 0 && y >= 0 &&
            x <= this.width && y <= this.height
        );
    }
}