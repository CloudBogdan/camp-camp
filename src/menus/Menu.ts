import { Engine, FontColor, Keyboard, Renderer } from "../engine";
import { Assets } from "../engine/core/Assets";
import { ICost } from "../managers/Inventory";
import Palette from "../utils/Palette";
import Config from "../utils/Config";

import PlayerHelpers from "../managers/PlayerHelpers";
import Utils from "../utils/Utils";

export interface IMenuButton {
    text: string
    tooltip?: string
    onClick?: ()=> void
    onEnter?: ()=> void
    onOut?: ()=> void
    visible?: ()=> boolean
    disabled?: ()=> boolean
    blur?: boolean
    tab?: string
    color?: FontColor | false
    building?: boolean
    sprite?: string
    spriteSX?: number
    spriteSY?: number
    spriteMargin?: number
    cost?: ICost
}
export interface IMenuTabs {
    [key: string]: IMenuButton[]
}

export default class Menu {
    x: number = 0;
    y: number = 0;

    isFocused: boolean = false;
    tabs: IMenuTabs = {}
    history: string[] = [];

    homeTabName: string;
    curTabName: string;
    curButtonIndex: number = 0;
    cost: ICost = {};

    nextTabIconImage = Assets.getImage("next-tab-icon");
    sizeAnimTimer = Engine.createTimer(4);

    constructor(homeTabName: string) {
        this.homeTabName = homeTabName;
        this.curTabName = homeTabName;

        this.history.push(this.homeTabName);
    }
    
    onScroll(currentButton: IMenuButton, buttonX: number, buttonY: number) {
        
    }
    
    //
    focus() {
        Engine.focusedMenu = this;
        this.isFocused = true;
        this.curButtonIndex = 0;

        this.onScroll(this.getCurTabButtons()[0], this.x, this.y);
    }
    blur() {
        const button = this.getCurTabButtons()[this.curButtonIndex];
        if (button && button.onOut)
            button.onOut();
        
        if (Engine.focusedMenu == this)
            Engine.focusedMenu = null;
            
        this.curButtonIndex = 0;
        this.isFocused = false;
        this.curTabName = this.homeTabName;
        this.cost = {};
        this.history = [this.homeTabName];

        this.onScroll(this.getCurTabButtons()[0], this.x, this.y);
    }
    openTab(name: string) {
        const button = this.getCurTabButtons()[this.curButtonIndex];
        if (button && button.onOut)
            button.onOut();
        
        this.curButtonIndex = 0;
        this.curTabName = name;

        this.onScroll(this.getCurTabButtons()[0], this.x, this.y);
        this.sizeAnimTimer.start();

        if (this.history.indexOf(this.curTabName) < 0)
            this.history.push(this.curTabName);
    }

    //
    update() {
        if (!this.isFocused) return;
        
        const curTabButtons = this.getCurTabButtons();

        if (Keyboard.justButton("down") || Keyboard.justButton("up")) {
            const lastButton = curTabButtons[this.curButtonIndex];

            this.curButtonIndex += +Keyboard.justButton("down") - +Keyboard.justButton("up");
            if (this.curButtonIndex > curTabButtons.length-1)
                this.curButtonIndex = 0;
            else if (this.curButtonIndex < 0)
                this.curButtonIndex = curTabButtons.length-1;
            
            const curButton = curTabButtons[this.curButtonIndex];
            
            if (lastButton) {
                lastButton.onOut && lastButton.onOut();
            }
            
            if (curButton) {
                this.onScroll(curButton, this.x, this.y + this.curButtonIndex * Config.SPRITE_SIZE);

                this.cost = curButton.cost || {};
                curButton.onEnter && curButton.onEnter();
            }
            
            this.sizeAnimTimer.start();
        }

        const button = curTabButtons[this.curButtonIndex];
        if (button)
            PlayerHelpers.setTooltip(button.tooltip || button.text, (button.disabled && button.disabled()) ? "red" : "gray");
        
        if (Keyboard.justButton("enter")) {
            const button = curTabButtons[this.curButtonIndex];
            if (!button || (button.visible && !button.visible()) || (button.disabled && button.disabled())) return; 

            button.onClick && button.onClick();

            if (button.blur) {
                this.blur();
            }
            if (button.tab) {
                this.openTab(button.tab);
            }
            
            Keyboard.reset()
        }
        if (Keyboard.justButton("esc")) {
            this.blur();
        }

        // Hotkeys
        if (Keyboard.justPressed) {
            const digitKey = Object.keys(Keyboard.pressedKeys)[0];
            
            if (/[1-9]/gm.test(digitKey)) {
                const button = curTabButtons[(+digitKey) - 1];
                if (!button || (button.visible && !button.visible()) || (button.disabled && button.disabled())) return; 
    
                button.onClick && button.onClick();
    
                if (button.blur) {
                    this.blur();
                }
                if (button.tab) {
                    this.openTab(button.tab);
                }
                
                Keyboard.reset()
            }
        }
    }
    draw() {
        const curTabButtons = this.getCurTabButtons();
        
        for (let i = 0; i < curTabButtons.length; i ++) {
            const button = curTabButtons[i];
            const isFocused = this.isFocused && this.curButtonIndex == i;
            const isDisabled = button.disabled ? button.disabled() : false;

            const width = 56;
            const height = Config.SPRITE_SIZE+1;
            const size = this.sizeAnimTimer.active ? 1 : 0;
            
            const color = button.color || (isFocused ? "black" : "gray");
            const spriteMargin = button.spriteMargin || 1;
            const x = this.x;
            const y = this.y + i * height;

            if (isFocused) {
                Renderer.rect(
                    x - size,
                    y - size,
                    width + size*2,
                    height + size*2,
                    Palette.WHITE
                );

                if (button.tab) {
                    Renderer.sprite(
                        this.nextTabIconImage,
                        x + width-8, y
                    )
                }
            }
            if (button.sprite) {
                Renderer.sprite(
                    Assets.getImage(button.sprite),
                    x, y,
                    button.spriteSX, button.spriteSY
                );
            }

            Renderer.text(
                button.text,
                x + (button.sprite ? height + spriteMargin : 0),
                y + Math.floor((height - Config.CHAR_HEIGHT)/2),
                (this.isFocused && !isDisabled) ? color : "dark-brown"
            );
        }
    }
    destroy() {
        Engine.destroyTimer(this.sizeAnimTimer);
    }

    // Get
    getCurTabButtons(): IMenuButton[] {
        return [
            {
                text: "назад",
                onClick: ()=> {
                    const lastTab = this.history[this.history.length-2];
                    
                    if (lastTab) {
                        Utils.removeItem(this.history, this.curTabName);
                        this.openTab(lastTab);
                    } else
                        this.blur();
                }
            },
            ...this.tabs[this.curTabName].filter(btn=> btn.visible ? btn.visible() : true)
        ];
    }
}