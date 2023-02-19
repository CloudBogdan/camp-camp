import { Random, Sprite } from "../../engine";
import Cells from "../../managers/Cells";
import Config from "../../utils/Config";
import Pathfinding from "../../utils/Pathfinding";
import { IArrayPoint, IPoint } from "../../utils/types";
import Utils from "../../utils/Utils";

export default class Entity extends Sprite {
    moveSpeed: number = 8;
    active: boolean = true;
    
    isMoving: boolean = false;
    justStopped: boolean = false;
    targetX: number = 0;
    targetY: number = 0;
    
    curPointIndex: number = 0;
    path: IArrayPoint[] = [];

    constructor(name: string, width?: number, height?: number) {
        super(name, width, height);

        this.velocityMultiplier.x = .1;
        this.velocityMultiplier.y = .1;
    }
    
    update() {
        super.update();

        this.updatePathMovement();
    }
    updateMovement() {
        if (!this.active) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            return;
        }
        
        super.updateMovement();
    }
    updatePathMovement() {
        if (!this.active || !this.isMoving || this.path.length == 0) {
            this.isMoving = false;
            return;
        }

        const curPoint = this.path[this.curPointIndex];
        if (!curPoint) return;
    
        const pointX = curPoint[0] * Config.NAV_GRID_SIZE + Config.NAV_GRID_SIZE/2;
        const pointY = curPoint[1] * Config.NAV_GRID_SIZE + Config.NAV_GRID_SIZE/2;
        
        this.move(
            pointX - this.x,
            pointY - this.y
        );

        if (Utils.distance(this.x, this.y, pointX, pointY) < .5) {
            this.curPointIndex ++;

            if (this.curPointIndex > this.path.length-1) {
                this.stopMove();
            }
        }
    }
    updateJust(): void {
        super.updateJust();
        this.justStopped = false;
    }

    move(dirX: number, dirY: number) {
        const vel = Utils.normalize(dirX, dirY);

        this.velocity.x += vel.x * this.moveSpeed;
        this.velocity.y += vel.y * this.moveSpeed;
    }
    moveTo(x: number, y: number): boolean {
        const result = this.calculatePath(x, y);
        
        this.isMoving = true;
        return result;
    }
    moveToCell(cell: Cell): boolean {
        const targetPos = cell.getNearestPosTo(this.x, this.y);
        return this.moveTo(targetPos.x, targetPos.y);
    }
    stopMove() {
        this.path = [];
        this.isMoving = false;
        this.justStopped = true;
    }

    updatePath(): boolean {
        return this.calculatePath(this.targetX, this.targetY);
    }
    calculatePath(toX: number, toY: number): boolean {
        this.targetX = toX;
        this.targetY = toY;
        this.path = [...Pathfinding.findPath(this.x, this.y, toX, toY)];
        
        if (this.isMoving && this.path.length > 1)
            this.curPointIndex = 1;
        else
            this.curPointIndex = 0;

        return this.path.length > 0;
    }

    walkAround() {
        const pos = Cells.getEmptyPos(
            ()=> this.x + Random.int(-10, 10),
            ()=> this.y + Random.int(-10, 10)
        );

        if (pos)
            this.moveTo(pos.x, pos.y);
    }

    //
    get isStopped(): boolean {
        return !this.isMoving;
    }
}