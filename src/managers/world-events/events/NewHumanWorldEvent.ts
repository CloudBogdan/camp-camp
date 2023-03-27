import { Random } from "../../../engine";
import Human from "../../../objects/entities/human/Human";
import Config from "../../../utils/Config";
import { IPoint } from "../../../utils/types";
import Camp from "../../Camp";
import Humans from "../../humans/Humans";
import Screen from "../../Screen";
import WorldEvent from "../WorldEvent";

export default class NewHumanWorldEvent extends WorldEvent {
    constructor() {
        super();
    }

    day(): void {
        super.day();

        const freeRooms = Camp.getRoomsCount() - Humans.count;

        if (freeRooms >= Config.MIN_FREE_ROOMS) {
            this.invoke();
        }
    }
    invoke(): void {
        super.invoke();

        const side = Random.int(0, 3);
        const pos: IPoint = { x: 0, y: 0 };

        if (side == 0) {
            pos.x = Random.float(0, Screen.width);
            pos.y = 0;
        } else if (side == 1) {
            pos.x = Screen.width;
            pos.y = Random.float(0, Screen.height);
        } else if (side == 2) {
            pos.x = Random.float(0, Screen.width);
            pos.y = Screen.height;
        } else if (side == 3) {
            pos.x = 0;
            pos.y = Random.float(0, Screen.height);
        }
        
        const human = new Human();
        Humans.settleHuman(human, ()=> pos.x, ()=> pos.y);
    }
}