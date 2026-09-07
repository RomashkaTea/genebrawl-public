import {GameStateManager} from "../../laser/client/state/GameStateManager";

const logicOffset = 40;
const clientInputManagerOffset = 88;

export class BattleMode {
    static getInstance(): NativePointer {
        if (GameStateManager.isState(5)) {
            return GameStateManager.getCurrentState();
        }

        return NULL;
    }

    static getLogic(): NativePointer {
        return this.getInstance().add(logicOffset).readPointer();
    }

    static getClientInputManager(): NativePointer {
        return this.getInstance().add(clientInputManagerOffset).readPointer();
    }
}
