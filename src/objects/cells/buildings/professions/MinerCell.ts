import { ICost } from "../../../../managers/Inventory";
import MinerProfession from "../../../entities/human/professions/MinerProfession";
import ProfessionCell from "./ProfessionCell";

export default class MinerCell extends ProfessionCell {
    constructor() {
        super("miner");

        this.animation.frames = [0, 1];

        this.load();
    }

    //
    getBuildCost(): ICost {
        return {
            "wood": {
                count: 30,
                remove: true
            }
        }
    }
    getProfessionClass(): TypeofSampleHumanProfession {
        return MinerProfession
    }
    getDisplayName(): string {
        return "шахтер"
    }
}