import CampfireCell from "../objects/cells/buildings/CampfireCell";
import Cursor from "../objects/cursor/Cursor";

export default class Objects {
    static started = false;
    
    static cursor: Cursor;
    static campfire: CampfireCell;
    
    static start() {
        if (this.started) return;
        
        this.cursor = new Cursor();
        this.campfire = new CampfireCell();

        this.started = true;
    }
}