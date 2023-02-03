import { ICost } from "../../../../managers/Inventory";
import ArchitectProfession from "../../../entities/human/professions/ArchitectProfession";
import ProfessionCell from "./ProfessionCell";

export default class ArchitectCell extends ProfessionCell {
    constructor() {
        super("architect");

        this.animation.frames = [0];

        this.load();
    }

    //
    getBuildCost(): ICost {
        return {
            "wood": {
                count: 25,
                remove: true
            },
            "stone": {
                count: 5,
                remove: true
            }
        }
    }
    getProfession(): HumanProfession {
        return new ArchitectProfession();
    }
    getDisplayName(): string {
        return "архитектор"
    }
}