import CampfireCell from "../objects/cells/buildings/CampfireCell";
import Cursor from "../objects/Cursor";

export default class Objects {
    static cursor: Cursor;
    static campfire: CampfireCell;
    
    static start() {
        this.cursor = new Cursor();
        this.campfire = new CampfireCell();
    }
}