import {Libc} from "../../libs/Libc";
import {Libg} from "../../libs/Libg";

const allocSize = 60;

const inputTypeOffset = 4;
const xOffset = 8;
const yOffset = 12;

const ClientInput_ctor = new NativeFunction( // "scid_button_tutorial", find function with 2nd arg is 12
    Libg.offset(0x985690, 0x48D210), 'void', ['pointer', 'int']
);

export class ClientInput {
    instance: NativePointer;

    get inputType(): ClientInputType {
        return this.instance.add(inputTypeOffset).readInt() as ClientInputType;
    }

    constructor(inputType: ClientInputType | number | NativePointer) {
        if (inputType instanceof NativePointer) {
            this.instance = inputType;

            return;
        }

        this.instance = Libc.malloc(allocSize);
        ClientInput_ctor(this.instance, inputType);
    }

    setXY(x: number, y: number) {
        this.instance.add(xOffset).writeInt(x);
        this.instance.add(yOffset).writeInt(y);
    }

    getX(): number {
        return this.instance.add(xOffset).readInt();
    }

    getY(): number {
        return this.instance.add(yOffset).readInt();
    }

    toString(): string {
        return `ClientInput{x=${this.getX()}, y=${this.getY()}, type=${ClientInput.getInputType(this.instance)}}`;
    }

    static getInputType(instance: NativePointer): number {
        return instance.add(inputTypeOffset).readInt();
    }
}

export enum ClientInputType {
    Attack = 0,
    Ulti = 1,
    Movement = 2,
    StopMovement = 3,
    EndBattle = 4,
    UltiEnable = 5,
    UltiDisable = 6,
    CarryableAim = 7,
    Accessory = 8,
    Emote = 9,
    ControlledProjectileStopWithStick = 10,
    ToggleEditing = 11,
    LeaveFromBattle = 12,
    StopHoldSkill = 13,
    StartHoldSkill = 14,
    Spray = 15,
    Overcharge = 17
}
