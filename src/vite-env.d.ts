/// <reference types="vite/client" />

import THuman from "./objects/entities/human/Human";
import TDwellingCell from "./objects/cells/buildings/DwellingCell";
import TProfessionCell from "./objects/cells/buildings/professions/ProfessionCell";
import THouseCell from "./objects/cells/buildings/HouseCell";
import TOrdersMenu from "./gui/game/OrdersMenu";
import TMenu from "./menus/Menu";
import TSampleHumanProfession, { IProfessionValues as TIProfessionValues } from "./objects/entities/human/professions/SampleHumanProfession";
import TSampleHumanTask, { HumanTaskType as THumanTaskType } from "./objects/entities/human/tasks/SampleHumanTask";
import TCell from "./objects/cells/Cell";
import TOrder, { OrderType as TOrderType } from "./managers/orders/Order";
import TGameGui from "./gui/game/GameGui";
import { IMenuButton as TIMenuButton, IMenuTabs as TIMenuTabs } from "./menus/Menu"

declare global {
    type Human = THuman
    type DwellingCell = TDwellingCell
    type ProfessionCell = TProfessionCell
    type HouseCell = THouseCell
    type OrdersMenu = TOrdersMenu
    type Menu = TMenu;
    type TypeofSampleHumanProfession = typeof TSampleHumanProfession;
    type SampleHumanProfession = TSampleHumanProfession;
    type IProfessionValues = TIProfessionValues;
    type SampleHumanTask = TSampleHumanTask;
    type HumanTaskType = THumanTaskType;
    type Cell = TCell;
    type Order = TOrder;
    type OrderType = TOrderType;
    type GameGui = TGameGui;
    type TypeofGameGui = typeof TGameGui;
    type IMenuButton = TIMenuButton;
    type IMenuTabs = TIMenuTabs;
}
