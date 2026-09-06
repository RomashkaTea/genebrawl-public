import {Libg} from "../../libs/Libg";
import {LogicData} from "./LogicData";
import {GeneAssets} from "../../gene/GeneAssets";

const LogicThemeData_isDisabled = new NativeFunction( // "Active theme is marked disabled! theme:"
    Libg.offset(0x8F2C98, 0x41EFD8), 'bool', ['pointer']
);

const LogicThemeData_getFileName = new NativeFunction( // "HomeScreen::enter - active theme sc file doesn't exist! theme:"
    Libg.offset(0x8F2CA8, 0x41EFE8), 'pointer', ['pointer']
);

const LogicThemeData_getExportName = new NativeFunction( // "Active theme is marked disabled! theme:"
    Libg.offset(0x8F2CB8, 0x41EFF8), 'pointer', ['pointer']
);

const musicOffset = 88;

export class LogicThemeData extends LogicData {
    constructor(instance: NativePointer) {
        super(instance);
    }

    isDisabled() {
        return LogicThemeData.isDisabled(this.instance);
    }

    getFileName(): string {
        return LogicThemeData.getFileName(this.instance).fromsc();
    }

    getExportName(): string {
        return LogicThemeData.getExportName(this.instance).fromsc();
    }

    getThemeMusic(): NativePointer {
        return LogicThemeData.getMusic(this.instance);
    }

    static getFileName(themeData: NativePointer): NativePointer {
        return LogicThemeData_getFileName(themeData);
    }

    static getExportName(themeData: NativePointer): NativePointer {
        return LogicThemeData_getExportName(themeData);
    }

    static isDisabled(themeData: NativePointer): boolean {
        return Boolean(
            LogicThemeData_isDisabled(themeData)
        );
    }

    static getMusic(themeData: NativePointer): NativePointer {
        return themeData.add(musicOffset).readPointer();
    }
}
