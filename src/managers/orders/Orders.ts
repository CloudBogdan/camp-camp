import { Trigger } from "../../engine";

import OrderParticle from "../../objects/particles/OrderParticle";
import Pathfinding from "../../utils/Pathfinding";
import Utils from "../../utils/Utils";
import Humans from "../humans/Humans";
import Particles from "../Particles";

export enum OrderChangeType {
    ADDED,
    DONE,
    TOOK
} 

export default class Orders {
    static orders: Order[] = [];

    static onChanged = new Trigger<{ order: Order, type: OrderChangeType }>("orders/on-added");
    
    //
    static onCellsChanged() {
        
    }
    
    //
    static addOrder(order: Order): Order | null {
        const successPaths = Humans.humansGroup.children.map(human=> {
            return human.pathToOrder(order).length > 0;
        }).filter(Boolean);
        
        if (successPaths.length > 0) {
            order.onAdd();

            Particles.addParticles(()=> new OrderParticle(), ()=> order.targetCell.x, ()=> order.targetCell.y);
            
            this.orders.splice(0, 0, order);
            this.onChanged.notify({ order, type: OrderChangeType.ADDED });
            
            return order;
        }

        return null;
    }
    static sortNearestOrdersTo(x: number, y: number): Order[] {
        return this.orders.sort((a, b)=> a.targetCell.distance(x, y) - b.targetCell.distance(x, y));
    }
    static getSuitableOrder(human: Human): Order | null {
        if (!human.getCanTakeOrders()) return null;
        
        for (const order of this.sortNearestOrdersTo(human.x, human.y)) {
            const targetCellPos = order.targetCell.getNearestPosTo(human.x, human.y);
            const pathToHuman = Pathfinding.findPath(targetCellPos.x, targetCellPos.y, human.x, human.y);
            const special = human.professions.current.onlyCategories.indexOf(order.category) >= 0;

            if (special && pathToHuman.length > 0 && !order.executor) {
                return order;
            }
        }

        return null;
    }
    static takeSuitableOrder(human: Human): Order | null {
        const order = this.getSuitableOrder(human);
        if (!order) return null;

        order.executor = human;
        order.onTake(human);
        
        human.onTakeOrder(order);
        order.targetCell.onTakeOrder(order);
        
        return order;
    }
    static doneOrder(order: Order | null, success: boolean): Order | null {
        if (!order) return null;
        const removedOrder = Utils.removeItem(this.orders, order);
        if (!removedOrder) return null;

        removedOrder.onDone();
        
        removedOrder.targetCell.onOrderDone(removedOrder, success);
        removedOrder.executor && removedOrder.executor.onOrderDone(removedOrder, success);
        
        return removedOrder;
    }
    static cancelOrder(order: Order | null): Order | null {
        if (!order) return null;
        const removedOrder = Utils.removeItem(this.orders, order);
        if (!removedOrder) return null;

        removedOrder.onCancel();

        const orderParticle = new OrderParticle();
        orderParticle.animation.reversed = true;
        orderParticle.animation.frameIndex = orderParticle.animation.frames.length-1;
        Particles.addParticles(()=> orderParticle, ()=> removedOrder.targetCell.x, ()=> removedOrder.targetCell.y);

        removedOrder.targetCell.onOrderCancel(removedOrder);
        removedOrder.executor && removedOrder.executor.onOrderCancel(removedOrder);

        return removedOrder;
    }
    static cancelAllOrders() {
        for (const order of [...this.orders]) {
            this.cancelOrder(order);
        }
    }

    // Get
    static get count(): number {
        return this.orders.length;
    }
}