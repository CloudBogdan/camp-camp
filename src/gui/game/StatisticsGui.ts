import { FontColor, Renderer } from "../../engine";
import { Assets } from "../../engine/core/Assets";
import Humans from "../../managers/humans/Humans";
import Inventory, { ICost } from "../../managers/Inventory";
import Orders from "../../managers/Orders";
import PlayerHelpers from "../../managers/PlayerHelpers";
import Screen from "../../managers/Screen";
import Config from "../../utils/Config";
import Palette from "../../utils/Palette";
import Utils from "../../utils/Utils";
import GameGui from "./GameGui";

interface IStatisticItem {
    name: string
    iconName: string
    debug?: boolean
    advanced?: boolean
    
    value: ()=> number | string
    warn?: ()=> boolean
}

export default class StatisticsGui {
    parent: typeof GameGui;
    
    x: number = 0;
    y: number = 0;

    items: IStatisticItem[] = [
        {
            name: "humans",
            iconName: "human-icon",
            value: ()=> Humans.count
        },
        {
            name: "orders",
            iconName: "order-icon",
            advanced: true,
            value: ()=> Orders.count
        },
        {
            name: "food",
            iconName: "food-icon",
            warn: ()=> Inventory.getIsCriticalFoodCount(),
            value: ()=> Inventory.food
        },
        {
            name: "wood",
            iconName: "wood-icon",
            warn: ()=> Inventory.getIsCriticalWoodCount(),
            value: ()=> Inventory.wood
        },
        {
            name: "stone",
            iconName: "stone-icon",
            warn: ()=> Inventory.getIsCriticalStoneCount(),
            value: ()=> Inventory.stone
        },
        {
            name: "happiness",
            iconName: "happiness-icon",
            warn: ()=> Humans.getIsCriticalHappinessLvl(),
            value: ()=> Utils.percent(Humans.happinessLevel)
        },

        {
            name: "stamina",
            advanced: true,
            iconName: "stamina-icon",
            value: ()=> Utils.percent(Humans.staminaLevel)
        },
        {
            name: "saturation",
            advanced: true,
            iconName: "saturation-icon",
            value: ()=> Utils.percent(Humans.saturationLevel)
        },

        {
            name: "rest",
            iconName: "stamina-icon",
            debug: true,
            value: ()=> Utils.percent(Humans.restLevel)
        },
        {
            name: "social",
            iconName: "happiness-icon",
            debug: true,
            value: ()=> Utils.percent(Humans.humans[0].social.level)
        },
    ]
    
    constructor(parent: typeof GameGui) {
        this.parent = parent;
        
        
    }

    update() {
        this.x = Screen.x - 10;
        this.y = Screen.y;
    }
    draw() {
        const cost: ICost = this.parent.ordersMenu.cost || {};
        const items = this.items.filter(item=> {
            const debug = item.debug ? Config.IS_DEV : true
            const advanced = item.advanced ? PlayerHelpers.showAdvancedStats : true
            
            return debug && advanced;
        });
        
        for (let i = 0; i < items.length; i ++) {
            const item = items[i];
            const size = Config.SPRITE_SIZE;
            const x = this.x;
            const y = this.y + i * size;

            const costItem = cost[item.name];
            const dangerColor: FontColor = "red";
            const normalColor: FontColor = item.debug ? "dark-brown" : "gray";
            let textColor: FontColor = (item.warn && item.warn()) ? dangerColor : normalColor;
            let removeTextColor: FontColor = "red";

            Renderer.sprite(
                Assets.getImage(item.iconName),
                x, y
            )
            
            if (costItem) {
                if (!costItem.remove)
                    removeTextColor = "green";
                else {
                    if (!Inventory.canRemove({ [item.name]: costItem }))
                        textColor = "red";
                }
            }
            
            const textWidth = Renderer.text(
                item.value().toString(),
                x - 2, y+1,
                textColor, "right"
            );
            
            if (PlayerHelpers.highlightStatName == item.name) {
                Renderer.strokeRect(
                    x - textWidth - 1 - 2, y,
                    textWidth + 11, 9,
                    Palette.ORANGE
                );
            }
            
            if (costItem) {
                Renderer.text(
                    `${ costItem.remove ? "-" : "+" }${ costItem.count }`,
                    x - textWidth - 6, y+1,
                    removeTextColor, "right"
                )
            }
        }
    }
}