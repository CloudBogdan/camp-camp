import { Trigger } from "../utils/Trigger";

interface IAssetsList {
    images: {
        [key: string]: HTMLImageElement
    }
    audio: {
        [key: string]: HTMLAudioElement
    }
}

export class Assets {
    static totalAssets: number = 0;
    static loadedAssets: number = 0;

    static onLoaded: Trigger<boolean> = new Trigger("assets/on-loaded");
    
    static assets: IAssetsList = {
        images: {},
        audio: {}
    }
    
    static init() {
        
    }

    //
    static loadImage(name: string, src: string) {
        this.totalAssets ++;
        
        const image = new Image();
        image.src = src;
        
        image.onload = ()=> {
            this.assets.images[name] = image;
            this.loadedAssets ++;

            // On assets loaded
            if (this.loadedAssets == this.totalAssets) {
                this.onLoaded.notify(true);
            }
        }
    }

    //
    static getImage(name: string): HTMLImageElement | null {
        return this.assets.images[name] || null;
    }

    // Get
    static get loaded(): boolean {
        return this.totalAssets == this.loadedAssets; 
    }
}