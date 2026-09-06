import {GameMain} from "../laser/client/GameMain";
import {DebugButton} from "./debug/DebugButton";
import {DebugInfo} from "./debug/DebugInfo";
import {DebugMenu} from "./debug/DebugMenu";
import {DisplayObject} from "../titan/flash/DisplayObject";
import {DebugHud} from "./debug/DebugHud";
import {UsefulInfo} from "./features/UsefulInfo";
import {LatencyManager} from "../laser/client/network/LatencyManager";
import {Configuration} from "./Configuration";
import {LocalizationManager} from "./localization/index";
import {Resources} from "./Resources";
import {GameStateManager} from "../laser/client/state/GameStateManager";
import {LobbyInfo} from "./features/LobbyInfo";
import {Storage} from "./Storage";
import {BattleSettingsPopup} from "./popups/BattleSettingsPopup";
import {BattleDebug} from "./BattleDebug";
import {MessageManager} from "../laser/client/network/MessageManager";
import {Filesystem} from "./features/filesystem";
import {Path} from "../titan/Path";

export class Debug {
    private static debugMenu?: DebugMenu;
    private static debugButton?: DebugButton;
    private static battleDebug?: BattleDebug;
    private static debugInfo?: DebugInfo;
    private static debugHud?: DebugHud;
    private static lobbyInfo?: LobbyInfo;
    private static battleSettingsPopup?: BattleSettingsPopup;
    private static latencyTestsAdded: boolean;
    private static resourcesLoaded: boolean;

    static isGeneAssetsPreloaded: boolean = false;

    private static displayObjectQueue: DisplayObject[] = [];

    static addResourcesToLoad() {
        if (!this.resourcesLoaded) {
            try {
                Resources.loadList.map((asset: string) => {
                    try {
                        if (Filesystem.doesFileExist(Path.getUpdatePath() + asset)) {
                            GameMain.loadAsset(asset);
                        }
                        else {
                            if (Filesystem.doesFileExist(Path.getResourcePath() + asset)) {
                                GameMain.loadAsset(asset);
                            }
                            else {
                                console.warn("Debug.addResourcesToLoad:", "not exist:", asset);
                            }
                        }
                    } catch (e) {
                        console.warn("Debug.addResourcesToLoad:", "failed to load", asset);
                    }
                });
            } catch (e) {
                console.warn("Debug.addResourcesToLoad:", "failed to load resources!");
            }

            this.resourcesLoaded = true;
        }
    }

    static update(deltaTime: number) {
        if (this.debugMenu) {
            this.debugMenu.update(deltaTime);

            if (!this.latencyTestsAdded) {
                if (LatencyManager.latencyTestsDone() && MessageManager.getLatencyTests().length > 0) {
                    console.log("LatencyManager: tests are done, add servers to debug menu");

                    LatencyManager.addServersToDebugMenu(this.debugMenu);

                    this.latencyTestsAdded = true;
                }
            }
        }

        if (this.debugHud) {
            const usefulInfoState = UsefulInfo.canBeUpdated();

            if (usefulInfoState !== this.debugHud.getShowMessageState()) {
                this.debugHud.showMessages(usefulInfoState);
            }

            // fix useful info drawing same value and not updating  when its completely disabled
            UsefulInfo.update();

            this.debugHud.draw();
        }

        if (this.displayObjectQueue.length > 0) {
            let gameSprite = GameMain.getGameSprite();

            this.displayObjectQueue.forEach((child) => {
                gameSprite.addChild(child);
            });

            this.displayObjectQueue = [];
        }

        if (GameStateManager.isHomeMode()) {
            LatencyManager.update();
        }

        this.lobbyInfo?.update();
        this.battleSettingsPopup?.update(deltaTime);
    }

    static hideDebugItems() {
        this.debugButton?.hide();
        this.debugMenu?.hide();
        this.debugHud?.showMessages(false);
        this.debugInfo?.hide();

        Configuration.showDebugItems = false;
        Configuration.save();
    }

    static showDebugItems() {
        this.debugButton?.show();

        Configuration.showDebugItems = true;
        Configuration.save();
    }

    static createDebugInfo(): DebugInfo {
        Debug.debugInfo = new DebugInfo();

        return Debug.debugInfo;
    }

    static create() {
        try {
            this.destruct(); // To make sure old debug menu doesn't exist

            this.displayObjectQueue = [];

            this.spawnLobbyInfo();
            this.spawnDebugButton();
            this.spawnDebugBattle();
            this.spawnDebugMenu();
            this.spawnDebugHud();
            this.spawnBattleSettings();

            console.log("Debug::create", "success!");
        } catch (e: any) {
            console.log(e.stack);
        }
    }

    private static spawnDebugBattle() {
        this.battleDebug = new BattleDebug();
        console.log("Debug.spawnDebugBattle");
    }

    private static spawnDebugButton() {
        this.debugButton = new DebugButton();

        this.displayObjectQueue.push(this.debugButton);

        console.log("Debug.spawnDebugButton:", "spawned debug button at " + this.debugButton.x + "," + this.debugButton.y);
    }

    private static spawnDebugMenu() {
        this.debugMenu = new DebugMenu();
        this.debugMenu.hide();

        this.displayObjectQueue.push(this.debugMenu);
    }

    private static spawnDebugHud() {
        this.debugHud = new DebugHud();
        this.debugHud.showMessages(true);
    }

    private static spawnBattleSettings() {
        this.battleSettingsPopup = new BattleSettingsPopup();
        this.battleSettingsPopup.hide();

        this.displayObjectQueue.push(this.battleSettingsPopup);
    }

    private static spawnLobbyInfo() {
        this.lobbyInfo = new LobbyInfo();
        this.lobbyInfo.showInfo(true);

        GameMain.getHomeSprite().addChildAt(this.lobbyInfo, 0);
    }

    static toggleDebugButtonPressed() {
        if (this.debugInfo?.visibility) {
            this.debugInfo?.hide();
        }

        this.debugMenu?.toggle();
    }

    static toggleSetAlphaButtonClicked() {
        this.battleSettingsPopup?.toggle();

        if (!this.battleSettingsPopup) {
            this.battleSettingsPopup = new BattleSettingsPopup();

            GameMain.getGameSprite().addChild(this.battleSettingsPopup);
        }
    }

    static getDebugButton(): DebugButton {
        return this.debugButton!;
    }

    static getBattleDebug(): BattleDebug {
        return this.battleDebug!;
    }

    static getDebugMenu(): DebugMenu {
        return this.debugMenu!;
    }

    static getDebugHud(): DebugHud {
        return this.debugHud!;
    }

    static getLobbyInfo(): LobbyInfo {
        return this.lobbyInfo!;
    }

    static getAlphaPopup(): BattleSettingsPopup {
        return this.battleSettingsPopup!;
    }

    static destruct() {
        if (!this.debugButton) {
            return;
        }

        this.debugButton.hide();
        GameMain.getGameSprite().removeChild(this.debugButton);
        this.debugButton = undefined;

        if (this.debugMenu) {
            this.debugMenu.hide();
            GameMain.getGameSprite().removeChild(this.debugMenu);

            this.debugMenu.destruct();
            this.debugMenu = undefined;
        }

        if (this.debugHud) {
            this.debugHud.showMessages(false);
            this.debugHud.destruct();
            this.debugHud = undefined;
        }

        if (this.debugInfo) {
            this.debugInfo.hide();

            GameMain.getGameSprite().removeChild(this.debugInfo);

            this.debugInfo.destruct();
        }

        if (this.lobbyInfo) {
            this.lobbyInfo.hide();

            GameMain.getHomeSprite().removeChild(this.lobbyInfo);

            this.lobbyInfo = undefined;
        }

        if (this.battleSettingsPopup) {
            this.battleSettingsPopup.hide();

            GameMain.getGameSprite().removeChild(this.battleSettingsPopup);

            this.battleSettingsPopup.destruct();
        }
    }
}
