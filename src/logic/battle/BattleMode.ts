import {GameStateManager} from "../../laser/client/state/GameStateManager";
import {LogicPlayer} from "./LogicPlayer";
import {LocalizationManager} from "../../gene/localization/index";
import { GUI } from "../../titan/flash/gui/GUI";

const logicOffset = 40;
const screenOffset = 8;
const clientInputManagerOffset = 88;

export class BattleMode {
    static xrayTargetPlayerIndex: number = -1;
    static xrayTargetGlobalId: number = 1;

    static getInstance(): NativePointer {
        if (GameStateManager.isState(5)) {
            return GameStateManager.getCurrentState();
        }

        return NULL;
    }

    static getLogic(): NativePointer {
        return this.getInstance().add(logicOffset).readPointer();
    }

    static getScreen(): NativePointer {
        return this.getInstance().add(screenOffset).readPointer();
    }

    static getClientInputManager(): NativePointer {
        return this.getInstance().add(clientInputManagerOffset).readPointer();
    }

    static setXrayTarget(playerName: string) {
        let playerIdx = Number(playerName.split(".")[0]);

        console.log("BattleMode.setXrayTarget:", "xray target: ", playerName);

        let logicBattleModeClient = this.getLogic();
        let players = logicBattleModeClient.readPointer();
        let playerPtr = players.add(Process.pointerSize * playerIdx).readPointer();

        //if (LogicPlayer.getName(playerPtr) == playerName) {
        this.xrayTargetPlayerIndex = LogicPlayer.getPlayerIndex(playerPtr);
        this.xrayTargetGlobalId = LogicPlayer.getCharacterGlobalId(playerPtr);

        console.log("BattleMode.setXrayTarget:", "found player with idx", this.xrayTargetPlayerIndex, "for xray, character id", LogicPlayer.getCharacterGlobalId(playerPtr));

        GUI.showFloaterText(
            LocalizationManager.getString("XRAY_TARGET_SELECTED").replace("%TARGET", LogicPlayer.getName(playerPtr))
        );
    }
}
