import { Engine, Keyboard, Sprite } from "../../engine";
import Game from "../../Game";
import GameGui from "../../gui/game/GameGui";
import Cells from "../../managers/Cells";
import PlayerHelpers from "../../managers/PlayerHelpers";
import Screen from "../../managers/Screen";
import Config from "../../utils/Config";
import Cell from "../cells/Cell";
import EmptyCell from "../cells/EmptyCell";
import PlacingArea from "./PlacingArea";

export default class Cursor extends Sprite {
    emptyCell: EmptyCell = new EmptyCell();
    sizeAnimationTimer = Engine.createTimer(4);
    placingArea = new PlacingArea()
    
    cellBelow: Cell = this.emptyCell;
    
    constructor() {
        super("cursor", 16, 16);

        this.x = 0;
        this.y = 0;
        
        this.animation.paused = true;
        this.animation.frames = [0, 1, 2];
        this.offset.x = 4;
        this.offset.y = 4;

        Cells.onChanged.listen(()=> {
            this.checkCellBelow();
        }, this.getListenerKey())
    }

    move(dirX: number, dirY: number) {
        if (Game.focusedMenu) return;
        if (dirX == 0 && dirY == 0) return;
        
        this.x += dirX * Config.GRID_SIZE;
        this.y += dirY * Config.GRID_SIZE;

        this.updateBounds();
        this.checkCellBelow();
        this.animateScale();
    }
    checkCellBelow() {
        const cell = Cells.getCellAt(this.x, this.y);
        if (cell && !cell.destroyed)
            this.cellBelow = cell;
        else
            this.cellBelow = this.emptyCell;
    }
    animateScale(duration?: number) {
        this.animation.frameIndex = 1;
        this.sizeAnimationTimer.start(duration);
    }
    
    //
    update(): void {
        super.update();

        if (this.allowMove) {
            if (Keyboard.justPressed) {
                this.move(
                    +Keyboard.isButton("right") - +Keyboard.isButton("left"),
                    +Keyboard.isButton("down") - +Keyboard.isButton("up")
                );
            }

            if (Keyboard.justButton("enter")) {
                GameGui.ordersMenu.focus();
                Keyboard.reset()
                this.animateScale(8);
            }
        }

        if (this.allowMove && this.cellBelow)
            PlayerHelpers.setTooltip(this.cellBelow.getTooltipName());

        
        this.placingArea.x = this.x - 4;
        this.placingArea.y = this.y - 4;
        const curBuilding = GameGui.ordersMenu.currentBuilding
        if (curBuilding) {
            this.placingArea.setSize(curBuilding.cellsWidth, curBuilding.cellsHeight)
            this.placingArea.frame.y = Cells.getCanBuildCell(curBuilding, this.x, this.y) ? 0 : 16
            
            this.placingArea.update()
        }

        //
        this.updateAnimation();
    }
    draw(): void {
        if (GameGui.ordersMenu.currentBuilding)
            this.placingArea.draw()
        else
            super.draw();
    }

    updateBounds() {
        if (this.x < 0) {
            this.x = Screen.width - Config.SPRITE_SIZE;
        } else if (this.x > Screen.width - Config.SPRITE_SIZE) {
            this.x = 0;
        }
        
        if (this.y < 0) {
            this.y = Screen.height - Config.SPRITE_SIZE;
        } else if (this.y > Screen.height - Config.SPRITE_SIZE) {
            this.y = 0;
        }
    }
    updateAnimation() {
        if (!this.sizeAnimationTimer.active)
            this.animation.frameIndex = 0;

        this.frame.y = +(!!Game.focusedMenu) * this.frame.height;
    }
    destroy(): void {
        super.destroy();

        Cells.onChanged.unlisten(this.getListenerKey());
        Engine.destroyTimer(this.sizeAnimationTimer);
    }

    // Get
    get allowMove(): boolean {
        return !Game.focusedMenu;
    }
}