import OrdersMenu from "./OrdersMenu";
import StatisticsGui from "./StatisticsGui";

export default class GameGuiObjects {
    static ordersMenu: OrdersMenu;
    static statistics: StatisticsGui;
    
    static start() {
        this.ordersMenu = new OrdersMenu();
        this.statistics = new StatisticsGui();
    }
}