import { Engine } from "./engine";
import { Assets } from "./engine/core/Assets";
import Game from "./Game";
import Translate from "./managers/Translate";
import CellsRegistry from "./registries/CellsRegistry";

Engine.prestart = ()=> {
    Assets.loadImage("cursor", "src/assets/images/gui/cursor.png");
    Assets.loadImage("human-icon", "src/assets/images/gui/human-icon.png");
    Assets.loadImage("food-icon", "src/assets/images/gui/food-icon.png");
    Assets.loadImage("wood-icon", "src/assets/images/gui/wood-icon.png");
    Assets.loadImage("stone-icon", "src/assets/images/gui/stone-icon.png");
    Assets.loadImage("happiness-icon", "src/assets/images/gui/happiness-icon.png");
    Assets.loadImage("stamina-icon", "src/assets/images/gui/stamina-icon.png");
    Assets.loadImage("saturation-icon", "src/assets/images/gui/saturation-icon.png");
    Assets.loadImage("order", "src/assets/images/gui/order.png");
    Assets.loadImage("order-icon", "src/assets/images/gui/order-icon.png");
    Assets.loadImage("happy-emotion", "src/assets/images/gui/happy-emotion.png");
    Assets.loadImage("sad-emotion", "src/assets/images/gui/sad-emotion.png");
    Assets.loadImage("angry-emotion", "src/assets/images/gui/angry-emotion.png");
    Assets.loadImage("tired-emotion", "src/assets/images/gui/tired-emotion.png");
    Assets.loadImage("food-emotion", "src/assets/images/gui/food-emotion.png");
    Assets.loadImage("next-tab-icon", "src/assets/images/gui/next-tab-icon.png");

    Assets.loadImage("house", "src/assets/images/cells/house.png");
    Assets.loadImage("gardener", "src/assets/images/cells/gardener.png");
    Assets.loadImage("builder", "src/assets/images/cells/builder.png");
    Assets.loadImage("architect", "src/assets/images/cells/architect.png");
    Assets.loadImage("miner", "src/assets/images/cells/miner.png");
    
    Assets.loadImage("campfire", "src/assets/images/cells/campfire.png");
    Assets.loadImage("statue", "src/assets/images/cells/statue.png");

    Assets.loadImage("layout-1x1", "src/assets/images/cells/layout-1x1.png");
    Assets.loadImage("layout-2x1", "src/assets/images/cells/layout-2x1.png");
    Assets.loadImage("scaffolding-1x1", "src/assets/images/cells/scaffolding-1x1.png");
    Assets.loadImage("scaffolding-2x1", "src/assets/images/cells/scaffolding-2x1.png");

    Assets.loadImage("tree", "src/assets/images/cells/tree.png");
    Assets.loadImage("apple-tree", "src/assets/images/cells/apple-tree.png");
    Assets.loadImage("grass", "src/assets/images/cells/grass.png");
    Assets.loadImage("stone", "src/assets/images/cells/stone.png");

    Assets.loadImage("leaf-particle", "src/assets/images/particles/leaf-particle.png");
    Assets.loadImage("fire-particle", "src/assets/images/particles/fire-particle.png");
    Assets.loadImage("order-particle", "src/assets/images/particles/order-particle.png");
    Assets.loadImage("stone-particle", "src/assets/images/particles/stone-particle.png");

    CellsRegistry.init();
    Translate.init();
};

Engine.start = ()=> Game.start();
Engine.update = ()=> Game.update();
Engine.draw = ()=> Game.draw();

Engine.init();
// Engine.init(WelcomeStage);
