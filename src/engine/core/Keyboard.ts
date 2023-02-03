import Config from "../../utils/Config";

type KeyboardButton = "right" | "left" | "up" | "down" | "enter" | "esc";

export class Keyboard {
    static pressedKeys: { [key: string]: boolean } = {};
    static isPressed: boolean = false;
    static justPressed: boolean = false;

    static buttons = {
        right: ["right", "d"],
        left: ["left", "a"],
        up: ["up", "w"],
        down: ["down", "s"],
        enter: ["enter", "space"],
        esc: ["escape", "backspace"]
    }

    static init() {
        addEventListener("keydown", e=> {
            if (!Config.IS_DEV)
                e.preventDefault();
            
            this.pressedKeys[this.formatKey(e.code)] = true;

            this.justPressed = true;
            this.isPressed = true;
        });
        addEventListener("keyup", e=> {
            delete this.pressedKeys[this.formatKey(e.code)];

            this.isPressed = false;
        });
    }
    
    static isButton(button: KeyboardButton): boolean {
        for (const key of this.buttons[button]) {
            if (this.isKey(key))
                return true;
        }
        return false;
    }
    static justButton(button: KeyboardButton): boolean {
        for (const key of this.buttons[button]) {
            if (this.justKey(key))
                return true;
        }
        return false;
    }
    
    //
    static isKey(code: string): boolean {
        return this.isPressed && this.pressedKeys[this.formatKey(code)]
    }
    static justKey(code: string): boolean {
        return this.justPressed && this.pressedKeys[this.formatKey(code)]
    }

    //
    static formatKey(code: string): string {
        return code.toLowerCase().replace(/digit|key|arrow/gmi, "");
    }
    
    //
    static reset() {
        this.justPressed = false;
        this.isPressed = false;
        this.pressedKeys = {};
    }
    static updateJust() {
        this.justPressed = false;
    }
}