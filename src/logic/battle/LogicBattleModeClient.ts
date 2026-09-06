
import {Libg} from "../../libs/Libg";
import {LogicTileMap} from "./level/LogicTileMap";
import {LogicPlayer} from "./LogicPlayer";

const LogicBattleModeClient_getOwnCharacter = new NativeFunction( // "spray_def_atk" (not sure)
    Libg.offset(0x9C4330, 0x4B7480), 'pointer', ['pointer']
);

const LogicBattleModeClient_ownPlayerIndexOffset = 224;
const LogicBattleModeClient_ownPlayerTeamOffset = 228;
const LogicBattleModeClient_tileMapOffset = 248;
const LogicBattleModeClient_currentBattleStateOffset = 284;
export const LogicBattleModeClient_gameModeVariationOffset = 292;
export const LogicBattleModeClient_underdogOffset = 334;

export class LogicBattleModeClient {
    static self: LogicBattleModeClient;

    private instance: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;

        LogicBattleModeClient.self = this;
    }

    static getOwnCharacter(logicBattleModeClient: NativePointer): NativePointer {
        return LogicBattleModeClient_getOwnCharacter(logicBattleModeClient);
    }

    static getTileMap(logicBattleModeClient: NativePointer): LogicTileMap {
        return new LogicTileMap(
            logicBattleModeClient.add(LogicBattleModeClient_tileMapOffset).readPointer()
        );
    }

    static isUnderdog(self: NativePointer): boolean {
        return Boolean(self.add(LogicBattleModeClient_underdogOffset).readU8());
    }
}
