import { Object, Random } from "../engine";
import Config from "./Config";
import { IPoint } from "./types";

export default class Utils {
    static toGridPos(x: number, y: number, gridSize: number=Config.GRID_SIZE): IPoint {
        return {
            x: Math.floor(x / gridSize) * gridSize,
            y: Math.floor(y / gridSize) * gridSize
        }
    }
    static toChunkPos(x: number, y: number, gridSize: number=Config.GRID_SIZE): IPoint {
        return {
            x: Math.floor(x / gridSize),
            y: Math.floor(y / gridSize)
        }
    }

    static percent(progress: number, symbol: string="%"): string {
        return (progress*100).toFixed(0) + symbol;
    }
    static safeValue<T>(value: T | null | undefined, safe: T): T {
        if (value === null || value === undefined)
            return safe;
        return value;
    }
    
    static removeItem<T>(array: T[], item: T | null): T | null {
        if (!item) return null;
        const index = array.indexOf(item);
        if (index < 0) return null;
        
        return array.splice(index, 1)[0];
    }
    static sortNearestObjectTo<T extends Object=Object>(array: T[], x: number, y: number): T[] {
        return array.sort((a, b)=> a.distance(x, y) - b.distance(x, y));
    }
    
    static randomDirection(multiplier: number=1): IPoint {
        const dir = Random.int(0, 3);

        if (dir == 0)
            return { x: 0, y: -multiplier };
        else if (dir == 1)
            return { x: multiplier, y: 0 };
        else if (dir == 2)
            return { x: 0, y: multiplier };
        else if (dir == 3)
            return { x: -multiplier, y: 0 };

        return { x: multiplier, y: 0 };
    }
    static pointInRect(px: number, py: number, rx: number, ry: number, rw: number, rh: number): boolean {
        return (
            px >= rx &&
            px < rx + rw &&
            py >= ry &&
            py < ry + rh
        )
    }
    static inBounds(value: number, from: number, to: number): boolean {
        return value >= from && value <= to;
    }
    static clamp(value: number, min: number, max: number=Infinity): number {
        if (value < min)
            return min;
        else if (value > max)
            return max;
        else 
            return value;
    }
    static normalize(x: number, y: number): IPoint {
        var m = Math.sqrt(x*x + y*y);
        if (m == 0) return { x: 0, y: 0 };
        
        x /= m
        y /= m

        return { x, y };
    }
    static distance(ax: number, ay: number, bx: number, by: number): number {
        return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
    }
    static lerp(from: number, to: number, amount: number): number {
        return from + (to - from) * amount;
    }
}