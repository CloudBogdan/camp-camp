interface ILang {
    [key: string]: (...args: any[])=> string
}

export default class Translate {
    static lang: "ru" | "en" = "ru";
    
    static currentLang: ILang = {}
    static ru: ILang = {
        "build": ()=> "строить",
        "break": ()=> "разобрать",
        "chop": ()=> "рубить",
    }
    static en: ILang = {

    }
    
    static init() {
        for (const key of Object.keys(this.en)) {
            this.currentLang[key] = this[this.lang][key] || this.en[key];
        }
    }

    static get(key: string, args: any[]): string {
        return this.currentLang[key.toLowerCase()](...args);
    }
}