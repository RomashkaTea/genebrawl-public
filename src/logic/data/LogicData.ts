import {Libg} from "../../libs/Libg";
import {Configuration} from "../../gene/Configuration";
import {GlobalID} from "./GlobalID";
import {CSVRow} from "../../titan/logic/csv/CSVRow";
import {StringTable} from "./StringTable";

const globalIdOffset = 32;
const LogicCharacterData_soundOffsetStart = 256;
const LogicSkinConfDataData_soundOffsetStart = 600;

const LogicData_getTID = Libg.offset(0x89D5E8, 0x3E1EF8); // "<HERO>"

const LogicSkillData_getAutoAttackType = new NativeFunction( // "AutoAttackType"
    Libg.offset(0x8E6838, 0x415284), 'int', ['pointer']
);

const LogicCharacterData_createReferences = new NativeFunction( // "Character has invalid type!"
    Libg.offset(0x889608, 0x3D37B8), 'void', ['pointer']
);

const LogicSkinConfData_createReferences = new NativeFunction( // "TransformWhenOvercharged" (resetStatics) then its xref
    Libg.offset(0x8E9D88, 0x417690), 'void', ['pointer']
);

const EmoteIcon_playAnim = new NativeFunction( // "emote_in_use_ph"
    Libg.offset(0x707708, 0x295D28), 'void', ['pointer', 'int', 'bool', 'float']
);

export class LogicData {
    instance: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
    }

    static patch() {
        Interceptor.replace(LogicSkillData_getAutoAttackType, new NativeCallback(function (skillData) {
            let type = LogicSkillData_getAutoAttackType(skillData);

            if (Configuration.movementBasedAutoshoot) {
                if (LogicData.getName(skillData) == "UndertakerWeapon")
                    type = 1;
            }

            return type;
        }, 'int', ['pointer']));

        if (!Configuration.emoteAnimation) {
            this.patchEmoteAnimation();
        }

        Interceptor.replace(LogicCharacterData_createReferences, new NativeCallback(function (characterData) {
            LogicCharacterData_createReferences(characterData);

            if (!Configuration.heroSounds) {
                for (let i = 0; i < 8; i++) {
                    characterData.add(LogicCharacterData_soundOffsetStart + (i * Process.pointerSize)).writePointer(NULL);
                }
            }
        }, 'void', ['pointer']));

        Interceptor.replace(LogicSkinConfData_createReferences, new NativeCallback(function (skinConfData) {
            LogicSkinConfData_createReferences(skinConfData);

            if (!Configuration.heroSounds) {
                for (let i = 0; i < 7; i++) {
                    skinConfData.add(LogicSkinConfDataData_soundOffsetStart + (i * Process.pointerSize)).writePointer(NULL);
                }
            }
        }, 'void', ['pointer']));
    }

    static patchEmoteAnimation() {
        Interceptor.replace(EmoteIcon_playAnim, new NativeCallback(function (emoteIcon, unk, unk2, unk3) {
            [unk, unk2, unk3] = [0, 0, 0];

            EmoteIcon_playAnim(emoteIcon, unk, unk2, unk3);
        }, 'void', ['pointer', 'int', 'bool', 'float']));
    }

    static revertEmoteAnimationPatch() {
        Interceptor.revert(EmoteIcon_playAnim);
    }

    static getGlobalIdOffset(): number {
        return globalIdOffset;
    }

    static getClassId(logicData: NativePointer): number {
        return GlobalID.getClassID(LogicData.getGlobalID(logicData));
    }

    static getInstanceId(logicData: NativePointer): number {
        return GlobalID.getInstanceID(LogicData.getGlobalID(logicData));
    }

    static getGlobalID(logicData: NativePointer): number {
        return logicData.add(globalIdOffset).readInt();
    }

    getClassId(): number {
        return LogicData.getClassId(this.instance);
    }

    getInstanceId(): number {
        return LogicData.getInstanceId(this.instance);
    }

    getGlobalID(): number {
        return LogicData.getGlobalID(this.instance);
    }

    setGlobalID(int: number) {
        this.instance.add(globalIdOffset).writeInt(int);
    }

    getName(): string {
        return LogicData.getName(this.instance);
    }

    static getName(logicData: NativePointer): string {
        return CSVRow.getName(logicData.add(Process.pointerSize).readPointer()).fromsc();
    }

    static getTID(logicData: NativePointer): string {
        return new NativeFunction(LogicData_getTID, 'pointer', ['pointer'])(logicData).fromsc();
    }

    static toLocalizedString(logicData: NativePointer): string {
        return StringTable.getString(this.getTID(logicData));
    }

    public getDataByOffset(offset: number) {
        return new LogicData(this.instance.add(offset).readPointer());
    }

    readVector(vectorPtr: NativePointer): NativePointer[] {
        const dataPtr = vectorPtr.readPointer();
        const size = vectorPtr.add(12).readU32();

        let elements: NativePointer[] = [];

        for (let i = 0; i < size; i++) {
            const entryPtr = dataPtr.add(i * Process.pointerSize).readPointer();
            elements.push(entryPtr);
        }

        return elements;
    }

    public getDataFromArrayByOffset(offset: number) {
        let ret: LogicData[] = [];
        this.readVector(this.instance.add(offset)).forEach(function (data) {
            ret.push(new LogicData(data));
        });
        return ret;
    }
}
