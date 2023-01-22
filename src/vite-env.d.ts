/// <reference types="vite/client" />

import THuman from "./objects/entities/human/Human";
import TDwellingCell from "./objects/cells/buildings/DwellingCell";
import TProfessionCell from "./objects/cells/buildings/professions/ProfessionCell";
import THouseCell from "./objects/cells/buildings/HouseCell";
import TOrdersMenu from "./gui/game/OrdersMenu";
import TMenu from "./menus/Menu";
import { THumanProfession as THumanProfession } from "./objects/entities/human/HumanProfessions";
import TCell from "./objects/cells/Cell";

declare global {
    type Human = THuman
    type DwellingCell = TDwellingCell
    type ProfessionCell = TProfessionCell
    type HouseCell = THouseCell
    type OrdersMenu = TOrdersMenu
    type Menu = TMenu;
    type HumanProfession = THumanProfession;
    type Cell = TCell;
}
