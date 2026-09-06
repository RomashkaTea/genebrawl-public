import {Configuration} from "../../gene/Configuration";
import {Debug} from "../../gene/Debug";
import {Storage} from "../../gene/Storage";
import {Libg} from "../../libs/Libg";
import {LogicDefines} from "../../LogicDefines";
import {Sprite} from "../../titan/flash/Sprite";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";
import {GeneAssets} from "../../gene/GeneAssets";


// Fields
const shouldReloadGameOffset = LogicDefines.isPlatformAndroid() ? 409 : 441; // "Server didn't reply to to the LoginMessage" xref -> GameMain::update
const lobbySpriteOffset = 288;
const spriteOffset = LogicDefines.isPlatformAndroid() ? 296 : 304; // "https://service.supercell.net/t?app=laser" in GameMain::init
const accountIdOffset = LogicDefines.isPlatformAndroid() ? 600 : 584;
const gameStateOffset = LogicDefines.isPlatformAndroid() ? 424 : 408;
const homeSpriteOffset = LogicDefines.isPlatformAndroid() ? 296 : 288;

// Function offsets
const GameMain_instance = Libg.offset(0x103AB80, 0xEE5B20); // MMWarned_  in GameMain::getInstance

const GameMain_setAccountTier = new NativeFunction( // "LoginFailed due to data version but not in InitState!"
    Libg.offset(0x3F3794, 0xB78C), 'void', ['pointer', 'int']
);

const GameMain_showNativeDialog = Libg.offset(0x0, 0x9418); // "TID_ERROR_POP_UP_SERVER_MAINTENANCE_ESTIMATED_MINUTES"

const GameMain_reloadGameInternal = new NativeFunction(
    Libg.offset(0x3F0A64, 0x8DEC), 'void', ['pointer']
);

// Native functions
const GameMain_setSlowMode = new NativeFunction( // higher than "after_trophies" first sub_xxx(0LL);
    Libg.offset(0x3F393C, 0xB914), 'void', ['bool']
);

const GameMain_loadAsset = new NativeFunction( // "sfx/supercell_jingle.ogg", func below with int 0 in 2nd arg
    Libg.offset(0x3F2D3C, 0xAFC8), 'void', ['pointer', 'bool']
);

const GameMain_draw = new NativeFunction( // vtable index 5 (5 * POINTER_SIZE) [then why tf we don't just get it from vtable???]
    Libg.offset(0x3F1E98, 0xA258), 'void', ['pointer', 'float']
);

export class GameMain {
    static alreadyLoaded: string[] = [];

    static get instance(): NativePointer {
        return GameMain_instance.readPointer();
    }

    static patch(): void {
        if (LogicDefines.isPlatformIOS()) {
            Interceptor.replace(GameMain_reloadGameInternal, new NativeCallback(function (gameMain) {
                if (!GameMain.isShouldReloadGame()) {
                    return;
                }

                GameMain_reloadGameInternal(gameMain);
            }, 'void', ['pointer']));
        }

        Interceptor.replace(GameMain_draw, new NativeCallback(function (gameMain, deltaTime) {
            GameMain_draw(gameMain, deltaTime);
            try {
                Storage.popups.forEach(e => e.update(deltaTime));
                Debug.update(deltaTime); // FIXME

                if (GameMain.isShouldReloadGame()) {
                    console.log("GameMain::draw:", "should reload game!");

                    Debug.destruct();
                }
            } catch (e: any) {
                console.error("GameMain::draw issue!");
                console.log(JSON.stringify(e));
                console.log(e.stack);
            }
        }, 'void', ['pointer', 'float']));

        Interceptor.replace(GameMain_setAccountTier, new NativeCallback(function (gameMain, accountTier) { // Helpshift patch
            accountTier = 3;

            GameMain_setAccountTier(gameMain, accountTier);
        }, 'void', ['pointer', 'int']));

        Interceptor.attach(GameMain_showNativeDialog, { // In case Stage Server is unavailable.
            onEnter(args) {
                if (args[1].toInt32() == 3 || args[1].toInt32() == 8) {
                    if (Configuration.useStage)
                        Configuration.useStage = false;
                }
            }
        });
    }

    static isShouldReloadGame(): boolean {
        return Boolean(
            this.instance.add(shouldReloadGameOffset).readU8()
        );
    }

    static shouldShowLoadingScreen(): boolean {
        return this.instance.add(gameStateOffset).readInt() == 10;
    }

    static reloadGame() {
        this.instance.add(shouldReloadGameOffset).writeU8(1);
    }

    static getGameSprite(): Sprite {
        return new Sprite(
            this.instance.add(spriteOffset).readPointer()
        );
    }

    static getLobbySprite(): Sprite {
        return new Sprite(
            this.instance.add(lobbySpriteOffset).readPointer()
        );
    }

    static getHomeSprite(): Sprite {
        return new Sprite(
            this.instance.add(homeSpriteOffset).readPointer()
        );
    }

    static setSlowMode(slowMode: boolean): void {
        GameMain_setSlowMode(Number(slowMode));
    }

    static loadAsset(filePath: string) {
        if (this.alreadyLoaded.includes(filePath)) return;

        GameMain_loadAsset(filePath.scptr(), 0);

        GameMain.alreadyLoaded.push(filePath);
        GeneAssets.loaded.push(filePath);

        console.log("GameMain::loadAsset: loaded " + filePath);
    }
}
