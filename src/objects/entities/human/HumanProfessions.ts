import { Trigger } from "../../../engine";
import Config from "../../../utils/Config";
import NoneProfession from "./professions/NoneProfession";

export default class HumanProfessions {
    human: Human

    isLearning: boolean = false;
    current: SampleHumanProfession = new NoneProfession();
    
    constructor(human: Human) {
        this.human = human;
    }

    is(professionClass: TypeofSampleHumanProfession): boolean {
        return this.current instanceof professionClass;
    }
    set(profession: SampleHumanProfession) {
        this.current = profession;
    }

    // Get
    get speedMultipliers(): IProfessionValues {
        return this.current.speedMultipliers;
    }
    get successChances(): IProfessionValues {
        return this.current.successChances;
    }
    get difficulties(): IProfessionValues {
        return this.current.difficulties;
    }
}