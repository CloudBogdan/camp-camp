import { Trigger } from "../../../engine";
import Config from "../../../utils/Config";
import NoneProfession from "./professions/NoneProfession";
import SampleHumanProfession, { IProfessionValues } from "./professions/SampleHumanProfession";

export default class HumanProfessions {
    human: Human

    learningTimeout: number = -1;
    learning: boolean = false;
    current: HumanProfession = new NoneProfession();

    onChanged = new Trigger<HumanProfession>("human-professions/on-changed");
    
    constructor(human: Human) {
        this.human = human;
    }

    is(professionClass: typeof SampleHumanProfession): boolean {
        return this.current instanceof professionClass;
    }
    set(profession: HumanProfession) {
        this.current = profession;
        this.onChanged.notify(profession);
    }
    learn(profession: HumanProfession): Promise<HumanProfession> {
        this.learning = true;
        
        return new Promise((resolve, reject)=> {
            this.learningTimeout = setTimeout(()=> {
                this.learning = false;
                this.set(profession);
                
                resolve(this.current);
            }, Config.HUMAN_STUDY_SECS_DURATION * 1000);
        });
    }
    stopLearning() {
        this.learning = false;
        clearTimeout(this.learningTimeout);
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