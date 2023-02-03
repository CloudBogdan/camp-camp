import { Sprite } from "../../engine";
import { Assets } from "../../engine/core/Assets";
import Config from "../../utils/Config";

export default class PlacingArea extends Sprite {
    constructor() {
        super("placing-area")

        this.animation.paused = false;
        this.animation.looped = true;
        this.animation.speed = 30;
        this.animation.frames = [0, 1];
        this.setSize(1, 1);
    }

    setSize(cellWidth: number, cellHeight: number) {
        this.image = Assets.getImage(`placing-area-${ cellWidth }x${ cellHeight }`)
        this.width = cellWidth * Config.SPRITE_SIZE + 8;
        this.height = cellHeight * Config.SPRITE_SIZE + 8;
        this.frame.width = this.width;
        this.frame.height = this.height;
    }
}