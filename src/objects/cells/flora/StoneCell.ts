import { Engine, Random } from "../../../engine";
import Generator from "../../../managers/Generator";
import Inventory, { ICost } from "../../../managers/Inventory";
import { OrderType } from "../../../managers/orders/Order";
import Particles from "../../../managers/Particles";
import Utils from "../../../utils/Utils";
import StoneParticle from "../../particles/StoneParticle";
import Cell from "../Cell";

export default class StoneCell extends Cell {
    depleted: boolean = false;
    growTimer = Engine.createTimer(7200); // 2 minutes
    
    constructor() {
        super("stone");

        this.animation.paused = true;
        this.animation.frames = [0, 1];

        this.animation.onFrameChanged.listen(()=> {
            this.animateScale(1.3, .7, true);
        })
    }

    update(): void {
        super.update();

        if (this.growTimer.justFinished) {
            this.depleted = false;
        }
    }
    updateAnimations(): void {
        super.updateAnimations();

        this.animation.frameIndex = 0;
        if (this.depleted)
            this.animation.frameIndex = 1;
    }
    destroy(): void {
        super.destroy();

        Engine.destroyTimer(this.growTimer);
    }
    
    mine(success: boolean) {
        if (success)
            Inventory.store(this.getBreakCost());

        this.depleted = true;
        this.animation.frameIndex = 1;
        this.growTimer.start();

        const pos = this.getCenter();
        Particles.addParticles(
            ()=> new StoneParticle(),
            ()=> pos.x + Random.int(-1, 1),
            ()=> pos.y + Random.int(-1, 1),
            2
        );
    }
    mineOrder() {
        this.replaceOrder(OrderType.MINE);
    }
    
    //
    onOrderDone(order: Order, success: boolean): void {
        super.onOrderDone(order, success);

        this.mine(success);
    }
    onOrderProcess(order: Order): void {
        super.onOrderProcess(order);

        this.animateScale(1.2, .8);
    }
    
    //
    getBreakCost(): ICost {
        return {
            "stone": {
                count: 10
            }
        }
    }
    getNamePrefix(): string {
        if (this.depleted)
            return "(истощен)";
        
        return super.getNamePrefix();
    }
    getDisplayName(): string {
        return "камень";
    }
    getCanBeMined(): boolean {
        return !this.depleted;
    }
    getOrdersMenuTab(menu: OrdersMenu): IMenuButton[] {
        return [
            {
                text: "добыть",
                onClick: ()=> this.mineOrder(),
                visible: ()=> this.getCanBeMined() && this.getOrderType() == null,
                cost: this.getBreakCost(),
                blur: true
            },
            ...super.getOrdersMenuTab(menu)
        ]
    }
    getGenerationRule(noiseX: number, noiseY: number, mapSize: number): boolean {
        const radial = Utils.distance(noiseX, noiseY, (mapSize-1)/2, (mapSize-1)/2) / mapSize;
        const value = Generator.simplex(noiseX/6, noiseY/6);
        
        return radial > .5 && value < .35;
    }
}