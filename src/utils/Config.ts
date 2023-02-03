export default class Config {
    static readonly IS_DEV: boolean = import.meta.env.DEV;

    static readonly CANVAS_WIDTH: number = 208;
    static readonly CANVAS_HEIGHT: number = 136;
    static readonly SPRITE_SIZE: number = 8;

    static readonly WORLD_SIZE: number = 12;
    static readonly WORLD_OFFSET_X: number = 16;
    static readonly WORLD_OFFSET_Y: number = 0;
    static readonly GRID_SIZE: number = 8;
    static readonly NAV_GRID_SIZE: number = 4;
    static get WORLD_NAV_SIZE(): number {
        return this.WORLD_SIZE / (this.NAV_GRID_SIZE / this.GRID_SIZE);
    }

    static readonly TIME_SPEED: number = this.IS_DEV ? (10) : (1);
    static readonly SUCCESS_CHANCE_MUL: number = this.IS_DEV ? (2) : (1);

    static readonly STARTER_HUMANS_COUNT: number = this.IS_DEV ? (4) : (4);
    static readonly HUMAN_STUDY_SECS_DURATION: number = this.IS_DEV ? (10) : (30);
    static readonly HUMAN_EAT_DURATION: number = 180;
    static readonly TAKE_TASK_SECS_DELAY: number = .5;

    static readonly FOOD_SATURATION: number = 5;

    static readonly FONT_SHEET_WIDTH: number = 78;
    static readonly CHAR_WIDTH: number = 6;
    static readonly CHAR_HEIGHT: number = 6;
}