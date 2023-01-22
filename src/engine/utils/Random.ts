export class Random {
    static float(from: number, to: number): number {
        return Math.random() * (to - from) + from;
    }
    static int(from: number, to: number): number {
        return Math.floor(this.float(from, to+1));
    }
    static bool(change: number): boolean {
        return this.float(0, 1) < change;
    }
    static item<T>(array: T[]): T {
        return array[this.int(0, array.length-1)];
    }
}