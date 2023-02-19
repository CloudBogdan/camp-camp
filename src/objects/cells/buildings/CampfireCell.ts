import { Random } from "../../../engine";
import Cells from "../../../managers/Cells";
import Humans from "../../../managers/humans/Humans";
import Inventory from "../../../managers/Inventory";
import Orders from "../../../managers/orders/Orders";
import PlayerHelpers from "../../../managers/PlayerHelpers";
import Config from "../../../utils/Config";
import { IPoint } from "../../../utils/types";
import Utils from "../../../utils/Utils";
import Human from "../../entities/human/Human";
import ArchitectProfession from "../../entities/human/professions/ArchitectProfession";
import BuilderProfession from "../../entities/human/professions/BuilderProfession";
import GardenerProfession from "../../entities/human/professions/GardenerProfession";
import MinerProfession from "../../entities/human/professions/MinerProfession";
import NoneProfession from "../../entities/human/professions/NoneProfession";
import Cell from "../Cell";

export default class CampfireCell extends Cell {
    constructor() {
        super("campfire");

        this.animation.frames = [0, 1, 2, 3, 4, 5];
        this.animation.speed = 10;
    }

    create(): void {
        super.create();

        for (let i = 0; i < Config.STARTER_HUMANS_COUNT; i ++) {
            const pos = this.getCenter();
            Humans.spawnHuman(
                new Human(),
                ()=> pos.x + Random.int(-8, 8),
                ()=> pos.y + Random.int(-8, 8)
            );
        }

    }

    //
    getOrdersMenuTab(menu: OrdersMenu): IMenuButton[] {
        return [
            {
                text: `жители (${ Humans.count })`,
                sprite: "human-icon",
                spriteMargin: -2,
                tab: "campfire/humans",
                onEnter: ()=> {
                    PlayerHelpers.highlightHumans = true;
                    PlayerHelpers.highlightStatName = "humans";
                },
                onOut: ()=> {
                    PlayerHelpers.highlightHumans = false;
                    PlayerHelpers.highlightStatName = null;
                }
            },
            {
                text: `задачи (${ Orders.count })`,
                sprite: "order-icon",
                spriteMargin: -2,
                tab: "campfire/orders",
                onEnter: ()=> {
                    PlayerHelpers.highlightOrders = true;
                    PlayerHelpers.highlightStatName = "orders";
                },
                onOut: ()=> {
                    PlayerHelpers.highlightOrders = false;
                    PlayerHelpers.highlightStatName = null;
                }
            },
            
            {
                text: `статистика`,
                tab: "campfire/stats"
            },

            ...super.getOrdersMenuTab(menu)
        ]
    }
    getMenuTabs(menu: OrdersMenu): IMenuTabs {
        const happinessLevel = Utils.percent(Humans.happinessLevel);
        const staminaLevel = Utils.percent(Humans.staminaLevel);
        const saturationLevel = Utils.percent(Humans.saturationLevel);
        
        return {
            "campfire/stats": [
                {
                    text: "еда " + Inventory.items["food"],
                    color: Inventory.getIsCriticalFoodCount() && "red",
                    sprite: "food-icon",
                    spriteMargin: -1,
                    onEnter: ()=> PlayerHelpers.highlightStatName = "food",
                    onOut: ()=> PlayerHelpers.highlightStatName = null,
                },
                {
                    text: "дерево " + Inventory.items["wood"],
                    color: Inventory.getIsCriticalWoodCount() && "red",
                    sprite: "wood-icon",
                    spriteMargin: -1,
                    onEnter: ()=> PlayerHelpers.highlightStatName = "wood",
                    onOut: ()=> PlayerHelpers.highlightStatName = null,
                },
                {
                    text: "камень " + Inventory.items["stone"],
                    color: Inventory.getIsCriticalStoneCount() && "red",
                    sprite: "stone-icon",
                    spriteMargin: -1,
                    onEnter: ()=> PlayerHelpers.highlightStatName = "stone",
                    onOut: ()=> PlayerHelpers.highlightStatName = null,
                },
                {
                    text: "счастье " + happinessLevel,
                    tooltip: "среднии уровень счастья " + happinessLevel,
                    color: Humans.getIsCriticalHappinessLvl() && "red",
                    sprite: "happiness-icon",
                    spriteMargin: -1,
                    onEnter: ()=> PlayerHelpers.highlightStatName = "happiness",
                    onOut: ()=> PlayerHelpers.highlightStatName = null,
                },
    
                {
                    text: "вынос. " + staminaLevel,
                    tooltip: "среднии уровень выносливости " + staminaLevel,
                    sprite: "stamina-icon",
                    spriteMargin: -1,
                    onEnter: ()=> PlayerHelpers.highlightStatName = "stamina",
                    onOut: ()=> PlayerHelpers.highlightStatName = null
                },
                {
                    text: "сытость " + saturationLevel,
                    tooltip: "среднии уровень сытости " + saturationLevel,
                    sprite: "saturation-icon",
                    spriteMargin: -1,
                    onEnter: ()=> PlayerHelpers.highlightStatName = "saturation",
                    onOut: ()=> PlayerHelpers.highlightStatName = null
                },

                {
                    text: `больше (${ PlayerHelpers.showAdvancedStats ? "вкл" : "выкл" })`,
                    tooltip: `больше данных (${ PlayerHelpers.showAdvancedStats ? "вкл" : "выкл" })`,
                    onClick: ()=> PlayerHelpers.showAdvancedStats = !PlayerHelpers.showAdvancedStats
                },
            ],
            "campfire/orders": [
                {
                    text: "отмена задач",
                    onClick: ()=> Orders.cancelAllOrders(),
                    disabled: ()=> Orders.count == 0,
                    onEnter: ()=> PlayerHelpers.highlightOrders = true,
                    onOut: ()=> PlayerHelpers.highlightOrders = false,
                    blur: true
                },
            ],
            "campfire/humans": [
                {
                    text: `без работы (${ Humans.humans.filter(h=> h.professions.is(NoneProfession)).length })`
                },
                {
                    text: `садовод (${ Humans.humans.filter(h=> h.professions.is(GardenerProfession)).length })`
                },
                {
                    text: `строитель (${ Humans.humans.filter(h=> h.professions.is(BuilderProfession)).length })`
                },
                {
                    text: `архитектор (${ Humans.humans.filter(h=> h.professions.is(ArchitectProfession)).length })`
                },
                {
                    text: `шахтер (${ Humans.humans.filter(h=> h.professions.is(MinerProfession)).length })`
                },
            ]
        }
    }
    getRandomPos(distance: number=30): IPoint | null {
        const center = this.getCenter();
        const pos = Cells.getEmptyPos(
            ()=> center.x + Random.int(-distance, distance),
            ()=> center.y + Random.int(-distance, distance)
        );

        return pos;
    }
    getDisplayName(): string {
        return "костeр";
    }
}