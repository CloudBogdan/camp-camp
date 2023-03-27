import { Keyboard } from "../../engine";
import Config from "../../utils/Config";
import NewHumanWorldEvent from "./events/NewHumanWorldEvent";
import WorldEvent from "./WorldEvent";

export default class WorldEvents {
    static events: { [key: string]: WorldEvent } = {};

    static addEvent(name: string, event: WorldEvent): WorldEvent {
        this.events[name] = event;

        return event;
    }

    //
    static start() {
        this.addEvent("new-human-world-event", new NewHumanWorldEvent());

        //
        for (const event of Object.values(this.events)) {
            event.start()
        }
    }
    static update() {
        if (Keyboard.justKey("V") && Config.IS_DEV)
            this.events["new-human-world-event"].invoke();
    }
    static day() {
        for (const event of Object.values(this.events)) {
            event.day()
        }
    }
}