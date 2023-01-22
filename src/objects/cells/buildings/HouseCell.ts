import { ISpriteIcon } from "../../../engine";
import { IMenuButton } from "../../../menus/Menu";
import OrdersMenu from "../../../gui/game/OrdersMenu";
import DwellingCell from "./DwellingCell";
import { ICost } from "../../../managers/Inventory";

export default class HouseCell extends DwellingCell {
    constructor() {
        super("house");

        this.animation.frames = [0, 1];

        this.maxLevels = 4;
    }
    
    //
    getBuildCost(): ICost {
        return {
            "wood": {
                count: 20,
                remove: true
            }
        }
    }
    getUpgradeCost(): ICost {
        if (this.level == 1)
            return {
                "wood": {
                    count: 20,
                    remove: true
                },
                "stone": {
                    count: 15,
                    remove: true
                }
            }
        else if (this.level == 2)
            return {
                "wood": {
                    count: 30,
                    remove: true
                },
                "stone": {
                    count: 30,
                    remove: true
                }
            }

        return {
            "wood": {
                count: 15,
                remove: true
            },
            "stone": {
                count: 10,
                remove: true
            }
        }
    }
    getMaxHumans(): number {
        return [1, 2, 3, 4][this.level];
    }
    getOrdersMenuTab(menu: OrdersMenu): IMenuButton[] {
        return [
            ...super.getOrdersMenuTab(menu)
        ]
    }
    getNamePrefix(): string {
        return `${ this.humans.length }/${ this.getMaxHumans() } ${ super.getNamePrefix() }`;
    }
    getDisplayName(): string {
        return `дом`;
    }
    getPreviewIcon(): ISpriteIcon {
        return {
            name: this.name,
            sliceX: 0,
            sliceY: this.created ? (this.level+1) * this.frame.height : 0
        }
    }

    //
    update(): void {
        super.update();
        
        this.frame.y = this.level * this.frame.height;
    }
    
}