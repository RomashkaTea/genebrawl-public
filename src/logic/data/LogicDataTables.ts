import {Libg} from "../../libs/Libg";
import {LogicData} from "./LogicData";
import {LogicThemeData} from "./LogicThemeData";
import {LogicCharacterData} from "./LogicCharacterData";
import {LogicPlayerTitleData} from "./LogicPlayerTitleData";
import {GlobalID} from "./GlobalID";
import {Configuration} from "../../gene/Configuration";
import {Constants} from "../../gene/Constants";
import {LogicSkinData} from "./LogicSkinData";

const LogicDataTables_getClientGlobals = new NativeFunction( // "CN_STARTUP_WARNING_BOTTOM"
    Libg.offset(0x8A5E94, 0x3E608C), 'pointer', []
);

const LogicDataTables_getTable = new NativeFunction( // "TID_SHOP_GEM_PACKS"
    Libg.offset(0x8A5E60, 0x3E6060), 'pointer', ['int']
);

const LogicDataTables_getThemeByName = new NativeFunction( // "Default"
    Libg.offset(0x8AE51C, 0x3EC13C), 'pointer', ['pointer', 'pointer']
);

const LogicDataTables_getDataById = new NativeFunction( // seasonend_brawler before brawler_txt
    Libg.offset(0x8A5F2C, 0x3E6120), 'pointer', ['int']
);

const LogicDataTables_getMenuMusic = new NativeFunction( // "MenuMusic"
    Libg.offset(0x8AD8AC, 0x3EB6E0), 'pointer', []
);

const LogicDataTables_getLocationThemeByName = new NativeFunction( // "HideIfNoCharacter", then function after function with dword in args
    Libg.offset(0x8AE55C, 0x3EC174), 'pointer', ['pointer', 'pointer']
);

const LogicClientGlobals_useNewBattleIntroOffset = 977; // "ENABLE_NEW_BATTLE_INTRO"

export class LogicDataTables {
    static getTable(table: number): NativePointer {
        return LogicDataTables_getTable(table);
    }

    static getMenuMusic(): NativePointer {
        return LogicDataTables_getMenuMusic();
    }

    static getThemeByName(themeName: string): LogicThemeData {
        return new LogicThemeData(LogicDataTables_getThemeByName(themeName.scptr(), NULL));
    }

    static getDataById(classId: number, instanceId: number) {
        const table = LogicDataTables.getTable(classId);

        const data = new NativeFunction(table.readPointer().add(40).readPointer(), 'pointer', ['pointer', 'int'])(table, instanceId);

        switch (classId) {
            case 16:
                return new LogicCharacterData(data);
            case 29:
                return new LogicSkinData(data);
            case 41:
                return new LogicThemeData(data);
            case 76:
                return new LogicPlayerTitleData(data);
            default:
                console.log(`LogicDataTables.getDataById(${classId}, ${instanceId})`, "-", "unknown table id", classId);
                return new LogicData(data);
        }
    }

    static getByGlobalId(globalId: number) {
        return LogicDataTables_getDataById(globalId);
    }

    static getClientGlobals() {
        return LogicDataTables_getClientGlobals();
    }

    static patchClientGlobals() {
        let clientGlobals = this.getClientGlobals();
        clientGlobals.add(LogicClientGlobals_useNewBattleIntroOffset).writeU8(Configuration.useOldIntro ? 0 : 1);
    }

    static patch() {
        Interceptor.replace(LogicDataTables_getDataById, new NativeCallback(function (globalId: number) {
            if (globalId === 0) {
                return LogicDataTables.getByGlobalId(globalId);
            }

            const classId = GlobalID.getClassID(globalId);

            switch (classId) {
                case 76:
                    const instanceId = GlobalID.getInstanceID(globalId);

                    if (instanceId >= 1000) {
                        return LogicDataTables.getByGlobalId(GlobalID.createGlobalID(76, 92));
                    }

                    return LogicDataTables.getByGlobalId(globalId);
                default:
                    return LogicDataTables.getByGlobalId(globalId);
            }
        }, "pointer", ["int"]));

        Interceptor.replace(LogicDataTables_getLocationThemeByName, new NativeCallback((namePtr, data) => {
            if (Configuration.darkTheme) {
                const name = namePtr.fromsc();

                if (name.includes("Showdown")) {
                    namePtr = Constants.DARK_THEME_SHOWDOWN_REPLACEMENT.scptr();
                } else {
                    namePtr = Constants.DARK_THEME_REPLACEMENT.scptr();
                }
            }

            return LogicDataTables_getLocationThemeByName(namePtr, data);
        }, 'pointer', ['pointer', 'pointer']));
    }
}
