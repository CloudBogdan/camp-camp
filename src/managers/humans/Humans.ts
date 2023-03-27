import anime from "animejs";
import { Engine, Group, Keyboard, Renderer, Sprite } from "../../engine";
import CloudParticle from "../../objects/particles/CloudParticle";
import FireworkParticle from "../../objects/particles/FireworkParticle";
import OrderParticle from "../../objects/particles/OrderParticle";
import Animations from "../../utils/Animations";
import Config from "../../utils/Config";
import Palette from "../../utils/Palette";
import { IPoint } from "../../utils/types";

import Cells from "../Cells";
import Orders from "../orders/Orders";
import Particles from "../particles/Particles";
import PlayerHelpers from "../PlayerHelpers";
import Screen from "../Screen";

export default class Humans {
    static started = false;

    static humansGroup = new Group<Human>();
    static happinessLevel: number = 1;
    static saturationLevel: number = 1;
    static staminaLevel: number = 1;
    static restLevel: number = 1;
    
    static spawnHuman(human: Human, xCallback: ()=> number, yCallback: ()=> number, ignoreCells: boolean=false): Human | null {
        let pos: IPoint | null = { x: xCallback(), y: yCallback() };
        
        if (!ignoreCells) 
            pos = Cells.getEmptyPos(()=> xCallback(), ()=> yCallback());

        if (!pos) return null;

        human.x = pos.x;
        human.y = pos.y;
        human.create();

        return this.humansGroup.add(human);
    }
    static destroyHuman(human: Human): boolean {
        return this.humansGroup.destroy(human);
    }
    static settleHuman(human: Human, xCallback: ()=> number, yCallback: ()=> number) {
        const pos = {
            x: xCallback(),
            y: yCallback()
        };

        const largeHumanSprite = new Sprite("large-human", 16, 16);
        largeHumanSprite.x = pos.x - 8 + Screen.x;
        largeHumanSprite.y = pos.y - 8 + Screen.y;
        largeHumanSprite.origin = { x: 8, y: 8 };
        
        Engine.spritesGroup.add(largeHumanSprite);

        Animations.blessedSpawn(largeHumanSprite, ()=> {
            Engine.spritesGroup.destroy(largeHumanSprite);
            Particles.addParticles(()=> new CloudParticle(), ()=> pos.x, ()=> pos.y, 4);
            
            human.emotion.set("happy");
            this.spawnHuman(human, ()=> pos.x, ()=> pos.y, true);
        });
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
        if (this.started) return;
        
        Orders.onChanged.listen(params=> {
            this.onOrdersChanged(params.order);
        }, "humans");

        this.started = true;
    }
    static update() {
        this.humansGroup.update();

        if (Config.IS_DEV) {
            if (Keyboard.justKey("H"))
                console.log(this.humans);
            if (Keyboard.justKey("T"))
                console.log(this.humans.map(h=> h.tasks));
        }
        
        this.calculateHumansNeeds();
    }
    static calculateHumansNeeds() {
        this.happinessLevel = 0;
        this.saturationLevel = 0;
        this.staminaLevel = 0;
        this.restLevel = 0;
        
        for (const human of this.humans) {
            this.happinessLevel += human.happiness.level;
            this.saturationLevel += human.saturation.level;
            this.staminaLevel += human.stamina.level;
            this.restLevel += human.rest.level;
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
    static destroy() {
        this.started = false;
        this.humansGroup.children = [];

        Orders.onChanged.unlisten("humans");
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