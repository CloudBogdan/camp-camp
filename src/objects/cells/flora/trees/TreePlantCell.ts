import { Random } from "../../../../engine";
import Animations from "../../../../utils/Animations";
import Cells from "../../../../managers/Cells";
import Inventory from "../../../../managers/Inventory";
import Particles from "../../../../managers/particles/Particles";
import LeafParticle from "../../../particles/LeafParticle";
import PlantCell from "../PlantCell";
import { OrderType } from "../../../../managers/orders/Order";
import { Assets } from "../../../../engine/core/Assets";
import Sounds from "../../../../managers/Sounds";

export default class TreePlantCell extends PlantCell {
    constructor(name: string) {
        super(name);
    }

    break(success: boolean): void {
        this.destroyed = true;

        this.spawnLeafs();

        if (!success) {
            Animations.scaleDown(this, ()=> Cells.destroyCell(this));
            return;
        }
        
        Animations.treeFall(this, ()=> Cells.destroyCell(this));
        Inventory.store(this.getBreakCost());
    }
    spawnLeafs() {
        const pos = this.getCenter();
        Particles.addParticles(
            ()=> new LeafParticle(),
            ()=> pos.x + Random.int(-2, 2),
            ()=> pos.y + Random.int(-2, 2),
            2
        );
    }

    //
    onOrderProcess(order: Order): void {
        super.onOrderProcess(order);

        if (order.equals([OrderType.CHOP])) {
            this.animateScale(1.3, .8);
        }
    }
    
    //
    getOrdersMenuTab(menu: OrdersMenu): IMenuButton[] {
        return [
            {
                text: "срубить",
                onClick: ()=> this.addOrder(OrderType.CHOP),
                visible: ()=> this.getOrderType() == null,
                cost: this.getBreakCost(),
                blur: true
            },
            ...super.getOrdersMenuTab(menu)
        ]
    }
}