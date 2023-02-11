import { Trigger } from "../../../engine";
import Config from "../../../utils/Config";
import NoneProfession from "./professions/NoneProfession";

export default class HumanProfessions {
    human: Human

    learningTimeout: number = -1;
    isLearning: boolean = false;
    current: SampleHumanProfession = new NoneProfession();

    onChanged = new Trigger<SampleHumanProfession>("human-professions/on-changed");
    
    constructor(human: Human) {
        this.human = human;
    }

    is(professionClass: TypeofSampleHumanProfession): boolean {
        return this.current instanceof professionClass;
    }
    set(profession: SampleHumanProfession) {
        this.current = profession;
        this.onChanged.notify(profession);
    }
    learn(profession: SampleHumanProfession): Promise<SampleHumanProfession> {
        this.isLearning = true;
        
        return new Promise((resolve, reject)=> {
            this.learningTimeout = setTimeout(()=> {
                this.isLearning = false;
                this.set(profession);
                
                resolve(this.current);
            }, Config.HUMAN_STUDY_SECS_DURATION * 1000);
        });
    }
    stopLearning() {
        this.isLearning = false;
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