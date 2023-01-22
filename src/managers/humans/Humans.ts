import { Engine, Group, Keyboard, Renderer } from "../../engine";
import Config from "../../utils/Config";
import Palette from "../../utils/Palette";

import Cells from "../Cells";
import Orders, { Order } from "../Orders";
import PlayerHelpers from "../PlayerHelpers";

export default class Humans {
    static humansGroup = new Group<Human>();
    static happinessLevel: number = 1;
    static saturationLevel: number = 1;
    static staminaLevel: number = 1;
    static restLevel: number = 1;
    
    static spawnHuman(human: Human, xCallback: ()=> number, yCallback: ()=> number): Human | null {
        const pos = Cells.getEmptyPos(()=> xCallback(), ()=> yCallback());
        if (!pos) return null;

        human.x = pos.x;
        human.y = pos.y;
        human.create();

        return this.humansGroup.add(human);
    }
    static destroyHuman(human: Human): boolean {
        return this.humansGroup.destroy(human);
    }
    
    //
    static onCellsChanged() {
        for (const human of this.humansGroup.children) {
            human.onCellsChanged();
        }
    }
    static onOrdersChanged(order: Order) {
        const cellPos = order.targetCell.getCenter();
        const humans = this.humansGroup.children
            .sort((a, b)=> {
                if (a.distance(cellPos.x, cellPos.y) > b.distance(cellPos.x, cellPos.y))
                    return -1;
                    
                return 0;
            }).reverse()
            .sort((a, b)=> {
                if (a.professions.current.priorityOrders.indexOf(order.type) >= 0)
                    return -1;

                return 0;
            })

        for (const human of humans) {
            Orders.takeSuitableOrder(human);
        }
    }
    
    //
    static start() {
        Orders.onChanged.listen(params=> {
            this.onOrdersChanged(params.order);
        });
    }
    static update() {
        this.humansGroup.update();

        if (Keyboard.justKey("V"))
            console.log(this.humans);
        
        this.calculateHumansNeeds();
    }
    static calculateHumansNeeds() {
        this.happinessLevel = 0;
        this.saturationLevel = 0;
        this.staminaLevel = 0;
        this.restLevel = 0;
        
        for (const human of this.humans) {
            this.happinessLevel += human.happiness.value / human.happiness.maxValue;
            this.saturationLevel += human.saturation.value / human.saturation.maxValue;
            this.staminaLevel += human.stamina.value / human.stamina.maxValue;
            this.restLevel += human.rest.value / human.rest.maxValue;
        }
        
        this.happinessLevel /= this.count;
        this.saturationLevel /= this.count;
        this.staminaLevel /= this.count;
        this.restLevel /= this.count;
    }
    static draw() {
        for (const human of this.humansGroup.children) {
            if (human.active && human.visible) {
                Renderer.rect(
                    Math.floor(human.x) - 1, Math.floor(human.y) - human.height - 1,
                    human.width+2, human.height+2,
                    Palette.GROUND
                );

                if (Engine.isDebug)
                    for (const point of human.path) {
                        Renderer.rect(
                            point[0] * Config.NAV_GRID_SIZE + Config.NAV_GRID_SIZE/2,
                            point[1] * Config.NAV_GRID_SIZE + Config.NAV_GRID_SIZE/2,
                            1, 1,
                            Palette.DARK_BROWN
                        );
                    }
            }
        }
        for (let i = 0; i < this.humans.length; i ++) {
            const human = this.humans[i];

            if (PlayerHelpers.highlightHumans ? Engine.time % 40 < 20 : true)
                human.draw();
        }
    }

    //
    static getIsCriticalHappinessLvl(): boolean {
        return this.happinessLevel < .4;
    }

    // Get
    static get count(): number {
        return this.humans.length; 
    }
    static get humans(): Human[] {
        return this.humansGroup.children;
    }
}