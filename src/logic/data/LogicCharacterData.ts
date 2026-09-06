import {Configuration} from "../../gene/Configuration";
import {Libg} from "../../libs/Libg";
import {LogicData} from "./LogicData";

const characterTypeOffset = 548;

const LogicCharacterData_useColorMod = new NativeFunction( // "UseColorMod"
    Libg.offset(0x88DFD4, 0x3D7CFC), 'int', ['pointer'] // in Character::update, "<= 0.0" check
);

const LogicCharacterData_getRedAdd = new NativeFunction( // "RedAdd"
    Libg.offset(0x88DFE4, 0x3D7D0C), 'int', ['pointer'] // first after LogicCharacterData::useColorMod check in Character::update
);

export class LogicCharacterData extends LogicData {
    constructor(instance: NativePointer) {
        super(instance);
    }

    static isHero(logicCharacterData: NativePointer) {
        return logicCharacterData.add(characterTypeOffset).readInt() == 0;
    }

    static useColorMod(logicCharacterData: NativePointer) {
        return LogicCharacterData_useColorMod(logicCharacterData);
    }

    static getRedAdd(logicCharacterData: NativePointer) {
        return LogicCharacterData_getRedAdd(logicCharacterData);
    }

    static patch() {
        Interceptor.replace(LogicCharacterData_useColorMod, new NativeCallback(function (logicCharacterData) {
            const name = LogicCharacterData.getName(logicCharacterData);

            if (name == "NinjaFake" && Configuration.markFakeNinja)
                return 1;

            return LogicCharacterData.useColorMod(logicCharacterData);
        }, 'int', ['pointer']));

        Interceptor.replace(LogicCharacterData_getRedAdd, new NativeCallback(function (logicCharacterData) {
            const name = LogicCharacterData.getName(logicCharacterData);

            if (name == "NinjaFake" && Configuration.markFakeNinja)
                return 255;

            return LogicCharacterData.getRedAdd(logicCharacterData);
        }, 'int', ['pointer']));
    }
}
