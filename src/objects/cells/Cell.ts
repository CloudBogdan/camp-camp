import anime from "animejs";
import { ISpriteIcon, Random, Sprite } from "../../engine";
import Cells from "../../managers/Cells";
import Orders from "../../managers/orders/Orders";
import Config from "../../utils/Config";
import Pathfinding from "../../utils/Pathfinding";
import { IPoint } from "../../utils/types";
import Utils from "../../utils/Utils";
import Inventory, { ICost } from "../../managers/Inventory";
import Screen from "../../managers/Screen";
import Order, { OrderCategory, OrderType } from "../../managers/orders/Order";

export interface ICellValues {
    [key: string]: number
}

export default class Cell extends Sprite {
    displayName: string;
    order: Order | null = null;
    created: boolean = false;
    
    cellsWidth: number = 1;
    cellsHeight: number = 1;
    animatedScale: number = 0;
    allowCreatingAnim: boolean = true;

    orderCategory: OrderCategory = OrderCategory.SIMPLE;
    canBeBuilt: boolean = false;
    canBePlanted: boolean = false;

    ordersSpeed: ICellValues = {
        [OrderType.BUILD]: 40,
        [OrderType.CHOP]: 50,
        [OrderType.PLANT]: 10,

        [OrderType.MINE]: 60,
        [OrderType.UPGRADE]: 40,
        [OrderType.HARVEST]: 10,
        
        [OrderType.CLEAR]: 8,
        [OrderType.BREAK]: 30,
    };
    
    constructor(name: string) {
        super(name);

        this.displayName = name;

        this.load();
    }

    load() {
        this.width = this.cellsWidth * Config.SPRITE_SIZE;
        this.height = this.cellsHeight * Config.SPRITE_SIZE;
        this.frame.width = this.width;
        this.frame.height = this.height;
    }
    create() {
        this.created = true;
    }
    use(human: Human): boolean {
        return true;
    }
    doOrder(human: Human) {
        if (this.order) {
            const orderType = this.order.type;
            const multiplier = human.professions.speedMultipliers[orderType] || 1;
            const successChance = (human.professions.successChances[orderType] || 1) * Config.SUCCESS_CHANCE_MUL;
            const orderSpeed = this.getOrderSpeed(this.order);

            const speed = Utils.clamp(Math.ceil(orderSpeed * multiplier / Config.TIME_SPEED), 1);
            
            if (this.time % speed == 0) {
                this.order.progress += .05;
                this.onOrderProcess(this.order);
                
                if (this.order.finished)
                    this.doneOrder(Random.bool(successChance));
            }
        }
    }
    destroy(): void {
        super.destroy();

        this.cancelOrder();
    }
    break(success: boolean) {
        if (success)
            Inventory.store(this.getBreakCost());

        Cells.destroyCell(this);
    }
    breakOrder() {
        this.replaceOrder(OrderType.BREAK);
    }

    animateScale(fromScaleX: number=1.3, fromScaleY: number=.7, force: boolean=false) {
        if ((this.tween && !force) ? this.tween.progress >= 25 : true) {
        
            this.scaleX = fromScaleX;
            this.scaleY = fromScaleY;
            this.playTween(anime({
                targets: this,
                scaleX: 1,
                scaleY: 1,
                easing: "spring(1, 60, 10, 0)"
            }))

        }
    }
    
    //
    onOrderProcess(order: Order) {
        
    }
    onTakeOrder(order: Order) {
        this.order = order;
    }
    onOrderCancel(order: Order) {
        this.order = null;
    }
    onOrderDone(order: Order, success: boolean) {
        this.order = null;

        if (order.equals([OrderType.BREAK, OrderType.CHOP, OrderType.CLEAR]))
            this.break(success);
    }
    onOrderAdded(order: Order) {
        this.order = order;
    }
    
    //
    cancelOrder() {
        Orders.cancelOrder(this.order);
    }
    doneOrder(success: boolean) {
        Orders.doneOrder(this.order, success);
    }
    addOrder(type: OrderType) {
        Orders.addOrder(new Order(type, this));
    }
    replaceOrder(type: OrderType) {
        this.cancelOrder();
        Orders.addOrder(new Order(type, this));
    }

    // Get
    getBuildCost(): ICost {
        return {};
    }
    getBreakCost(): ICost {
        const cost: ICost = {};
        const buildCost = this.getBuildCost();

        Object.keys(buildCost).map(itemType=> {
            cost[itemType] = {
                count: buildCost[itemType].count,
                remove: false
            }
        });
        
        return cost;
    }
    getOrderSpeed(order: Order): number {
        return this.ordersSpeed[order.type] || 1;
    }
    getNearestPosTo(x: number, y: number): IPoint {
        let pos = this.getCenter();
        const path = Pathfinding.findPath(x, y, pos.x, pos.y + 5);

        if (Screen.inBounds(pos.x, pos.y + 5) && path.length > 0)
            pos.y += 5;
        else
            pos.y -= 1;
            
        return pos;
    }
    getOrderType(): OrderType | null {
        return !!this.order ? this.order.type : null;
    }
    getIsSolid(): boolean {
        return true;
    }
    getOrdersMenuTab(menu: OrdersMenu): IMenuButton[] {
        return [
            {
                text: "отмена",
                onClick: ()=> this.cancelOrder(),
                visible: ()=> this.getOrderType() != null,
                blur: true 
            },
            {
                text: "<destroy>",
                onClick: ()=> Cells.destroyCell(this),
                visible: ()=> Config.IS_DEV,
                blur: true
            },
            {
                text: "<log>",
                onClick: ()=> console.log(this),
                visible: ()=> Config.IS_DEV,
                blur: true
            },
        ]
    }
    getMenuTabs(menu: OrdersMenu): IMenuTabs {
        return {};
    }
    getNamePrefix(): string {
        if (!this.order) return "";

        const percent = Utils.percent(this.order.progress);

        if (this.getOrderType() == OrderType.BREAK)
            return `(разобрать ${ percent })`;
        else if (this.getOrderType() == OrderType.UPGRADE)
            return `(улучшить ${ percent })`;
        else if (this.getOrderType() == OrderType.CLEAR)
            return `(убрать ${ percent })`;
        else if (this.getOrderType() == OrderType.CHOP)
            return `(срубить ${ percent })`;
        else if (this.getOrderType() == OrderType.MINE)
            return `(добыть ${ percent })`;
        else if (this.getOrderType() == OrderType.HARVEST)
            return `(собрать ${ percent })`;
        else if (this.getOrderType() == OrderType.PLANT)
            return `(посадить ${ percent })`;

        return "";
    }
    getDisplayName(): string {
        return this.displayName;
    }
    getTooltipName(): string {
        return [this.getDisplayName(), this.getNamePrefix()].filter(Boolean).join(" ");
    }
    getPreviewIcon(): ISpriteIcon {
        return {
            name: this.name,
            sliceX: 0,
            sliceY: 0
        };
    }
    getGenerationRule(noiseX: number, noiseY: number, mapSize: number): boolean {
        return false;
    }
}