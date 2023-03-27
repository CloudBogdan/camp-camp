import HouseCell from "../objects/cells/buildings/HouseCell";
import Cells from "./Cells";

export default class Camp {
    static getRoomsCount(): number {
        let rooms = 0;
        for (const houseCell of Cells.getCells<HouseCell>(HouseCell)) {
            rooms += houseCell.getMaxHumans();
        }
        
        return rooms;
    }
}