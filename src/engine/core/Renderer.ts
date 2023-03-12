import Config from "../../utils/Config";
import { Assets } from "./Assets";

import whiteFont_png from "../../assets/images/gui/white-font.png";
import darkBrownFont_png from "../../assets/images/gui/dark-brown-font.png";
import blackFont_png from "../../assets/images/gui/black-font.png";
import redFont_png from "../../assets/images/gui/red-font.png";
import greenFont_png from "../../assets/images/gui/green-font.png";
import grayFont_png from "../../assets/images/gui/gray-font.png";

export type FontColor = "white" | "dark-brown" | "black" | "red" | "gray" | "green" | "transparent";
export type TextAlign = "center" | "right" | "left";
interface IFontSettings {
    [key: string]: {
        width: number
        offsetX?: number
        offsetY?: number
    }
}

const FONT_MAPPING = " abcdefghijklmnopqrstuvwxyzабвгдежзиклмнопрстуфхцчшщъыьэюя0123456789+-=.,;:*/()&^<>%$#@!~\"'`?|\\_[]{}";
const FONT_SETTINGS: IFontSettings = {
    " ": { width: 3 },
    ".": { width: 3, offsetX: -1 },
    ",": { width: 3, offsetX: -1, offsetY: 1 },
    ";": { width: 3, offsetX: -1, offsetY: 1 },
    ":": { width: 3, offsetX: -1 },
    "(": { width: 3 },
    ")": { width: 3 },
    "!": { width: 3, offsetX: -1 },
    "'": { width: 3, offsetX: -1 },
    "`": { width: 4, offsetX: -1 },
    "|": { width: 3, offsetX: -1 },
    "[": { width: 4 },
    "]": { width: 4 },
    "ы": { width: 6, offsetX: 1 },
    "ж": { width: 6 },
    "щ": { width: 7, offsetX: 1 },
    "ш": { width: 6 },
    "ц": { width: 5 },
    "ю": { width: 6 },
}

export class Renderer {
    static canvas: HTMLCanvasElement;
    static context: CanvasRenderingContext2D;

    // Draw
    static color(color: string) {
        this.context.fillStyle = color;
    }
    static pixel(x: number, y: number, color?: string) {
        this.rect(x, y, 1, 1, color);
    }
    static rect(x: number, y: number, width: number, height: number, color?: string) {
        if (color)
            this.color(color);
        this.context.fillRect(x, y, width, height);
    }
    static strokeRect(x: number, y: number, width: number, height: number, color?: string) {
        this.rect(x, y, width, 1, color);
        this.rect(x + width-1, y, 1, height, color);
        this.rect(x, y + height-1, width, 1, color);
        this.rect(x, y, 1, height, color);
    }
    static sprite(image: HTMLImageElement | null, x: number, y: number, sx: number=0, sy: number=0, width: number=Config.SPRITE_SIZE, height: number=Config.SPRITE_SIZE) {
        if (!image) {
            this.strokeRect(x, y, width, height, "#f0f");
            return;
        }
        this.context.drawImage(
            image,
            sx, sy, width, height,
            x, y, width, height
        )
    }
    static background(color: string) {
        this.rect(0, 0, this.width, this.height, color);
    }
    static clear(x: number=0, y: number=0, width: number=this.width, height: number=this.height) {
        this.context.clearRect(x, y, width, height);
    }
    static dithering(x: number, y: number, width: number, height: number, color?: string, stage: number=1) {
        if (stage == 0)
            return;
        
        if (color)
            this.color(color);

        if (stage == 2)
            this.rect(x, y, width, height);
        else if (stage == 1) {
            for (let j = 0; j < height; j ++) {
                for (let i = 0; i < width; i ++) {

                    if ((x+i + y+j) % 2 == 0)
                        this.rect(x + i, y + j, 1, 1);
                    
                }
            }
        }
    }

    static char(char: string, x: number, y: number, font: HTMLImageElement) {
        const charPos = FONT_MAPPING.indexOf(char.toLowerCase()) * Config.CHAR_WIDTH;

        this.sprite(
            font,
            x, y,
            charPos % Config.FONT_SHEET_WIDTH,
            Math.floor(charPos / Config.FONT_SHEET_WIDTH) * Config.CHAR_HEIGHT,
            Config.CHAR_WIDTH, Config.CHAR_HEIGHT
        );
    }
    static text(text: string, x: number, y: number, color: FontColor="white", align: TextAlign="left"): number {
        const font = Assets.getImage(`${ color }-font`)!;
        if (!font && color != "transparent") return 0;

        const textWidth = this.calculateTextWidth(text);

        if (color != "transparent") {
            let textOffsetX = 0;

            if (align == "center") {
                textOffsetX = Math.floor(textWidth/2);
            } else if (align == "right") {
                textOffsetX = textWidth;
            }

            for (let i = 0; i < text.length; i ++) {
                const char = text[i];
                const settings = FONT_SETTINGS[char];
                const offsetX = settings?.offsetX || 0;
                const offsetY = settings?.offsetY || 0;
                
                const lastWidth = this.calculateTextWidth(text.slice(0, i));

                this.char(
                    char,
                    x + lastWidth + offsetX - textOffsetX,
                    y + offsetY,
                    font
                );
            }
        }

        return textWidth;
    }
    static calculateTextWidth(text: string): number {
        let result = 0;

        for (const char of text) {
            const charSettings = FONT_SETTINGS[char] || null;
            result += charSettings?.width || (Config.CHAR_WIDTH-2);
        }

        return result;
    }

    static save() {
        this.context.save();
    }
    static restore() {
        this.context.restore();
    }
    static translate(x: number, y: number) {
        this.context.translate(x, y);
    }
    
    //
    static init() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d")!;
        this.canvas.width = Config.CANVAS_WIDTH;
        this.canvas.height = Config.CANVAS_HEIGHT;

        this.context.imageSmoothingEnabled = false;

        document.body.appendChild(this.canvas);

        //
        Assets.loadImage("white-font", whiteFont_png)
        Assets.loadImage("dark-brown-font", darkBrownFont_png)
        Assets.loadImage("black-font", blackFont_png)
        Assets.loadImage("gray-font", grayFont_png)
        Assets.loadImage("red-font", redFont_png)
        Assets.loadImage("green-font", greenFont_png)
    }

    // Get
    static get width(): number {
        return this.canvas.width;
    }
    static get height(): number {
        return this.canvas.height;
    }
}