import { Assets } from "../engine/core/Assets";
import Utils from "../utils/Utils";

interface IPlayingSound {
    time: number
    name: string
    delayLimit: number
    sound: HTMLAudioElement
}

export default class Sounds {
    static playingSounds: IPlayingSound[] = [];
    
    static playSound(name: string, volume: number=1, speed: number=1, delayLimit: number=0): HTMLAudioElement | null {
        const soundAsset = Assets.getSound(name);
        if (!soundAsset) return null;
        
        if (delayLimit > 0 && this.playingSounds.findIndex(s=> s.name == name && s.delayLimit > 0 && (Date.now() - s.time < delayLimit*1000)) >= 0) {
            return null;
        }
        
        const sound = new Audio();
        sound.src = soundAsset.src;
        sound.volume = volume;
        sound.playbackRate = speed;
        sound.play();

        const playingSound: IPlayingSound = {
            time: Date.now(),
            name: name,
            delayLimit: delayLimit,
            sound: sound
        }
        this.playingSounds.push(playingSound);
        
        sound.onended = ()=> {
            Utils.removeItem(this.playingSounds, playingSound);
            
            sound.remove();
        }

        return sound;
    }
}