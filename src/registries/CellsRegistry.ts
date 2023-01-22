import HouseCell from "../objects/cells/buildings/HouseCell";
import ArchitectCell from "../objects/cells/buildings/professions/ArchitectCell";
import BuilderCell from "../objects/cells/buildings/professions/BuilderCell";
import GardenerCell from "../objects/cells/buildings/professions/GardenerCell";
import MinerCell from "../objects/cells/buildings/professions/MinerCell";
import StatueCell from "../objects/cells/buildings/StatueCell";
import GrassCell from "../objects/cells/flora/GrassCell";
import StoneCell from "../objects/cells/flora/StoneCell";
import AppleTreeCell from "../objects/cells/flora/trees/AppleTreeCell";
import TreeCell from "../objects/cells/flora/trees/TreeCell";

type CellCallback = ()=> Cell
interface IRegisteredCells {
    [key: string]: CellCallback
}

export default class CellsRegistry {
    static registeredCells: IRegisteredCells = {}
    
    static init() {
        this.registerCell(()=> new HouseCell());
        this.registerCell(()=> new GardenerCell());
        this.registerCell(()=> new BuilderCell());
        this.registerCell(()=> new ArchitectCell());
        this.registerCell(()=> new MinerCell());

        this.registerCell(()=> new StatueCell());

        this.registerCell(()=> new StoneCell());
        this.registerCell(()=> new TreeCell());
        this.registerCell(()=> new AppleTreeCell());
        this.registerCell(()=> new GrassCell());
    }

    //
    static getCell(name: string): Cell | null {
        const cellCallback = this.getCellCallback(name);
        if (!cellCallback) return null;
        return cellCallback();
    }
    static getCellCallback(name: string): CellCallback | null {
        return this.registeredCells[name] || null;
    }
    static getCellsCallbackArray(): CellCallback[] {
        return Object.values(this.registeredCells);
    }
    
    //
    static registerCell(cellCallback: CellCallback) {
        const cell = cellCallback();
        this.registeredCells[cell.name] = cellCallback;
    }
}