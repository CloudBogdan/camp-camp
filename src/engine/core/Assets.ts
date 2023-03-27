import { Trigger } from "../utils/Trigger";

interface IAssetsList {
    images: {
        [key: string]: HTMLImageElement
    }
    sounds: {
        [key: string]: HTMLAudioElement
    }
}

export class Assets {
    static totalAssets: number = 0;
    static loadedAssets: number = 0;

    static onLoaded: Trigger<boolean> = new Trigger("assets/on-loaded");
    
    static assets: IAssetsList = {
        images: {},
        sounds: {}
    }
    
    static init() {
        
    }

    //
    static loadImage(name: string, src: string) {
        this.totalAssets ++;
        
        const image = new Image();
        image.src = src;
        this.assets.images[name] = image;
        
        image.onload = ()=> {
            this.loadedAssets ++;
        }
    }
    static loadSound(name: string, src: string) {
        this.totalAssets ++;
        
        const sound = new Audio();
        sound.src = src;
        this.assets.sounds[name] = sound;
        
        sound.onload = ()=> {
            this.loadedAssets ++;
        }
    }

    //
    static getImage(name: string): HTMLImageElement | null {
        return this.assets.images[name] || null;
    }
    static getSound(name: string): HTMLAudioElement | null {
        return this.assets.sounds[name] || null;
    }

    // Get
    static get loaded(): boolean {
        return this.totalAssets <= this.loadedAssets; 
    }
}