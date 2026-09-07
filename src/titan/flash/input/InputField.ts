import {TextField} from "../TextField";
import {TextInput} from "./TextInput";

// InputField_ctor: txt_input_field_playerid
const InputField_inputTextOffset = 32;
const InputField_updateVtableOffset = 11 * Process.pointerSize;

export class InputField extends TextInput {
    private readonly updateFunc: NativeFunction<void, [NativePointerValue, number]>;

    constructor(instance: NativePointer, textField: TextField) {
        super(instance);

        this.updateFunc = new NativeFunction(this.vtable.add(InputField_updateVtableOffset).readPointer(), 'void', ['pointer', 'float']);
    }

    getInputText() {
        return this.instance.add(InputField_inputTextOffset).fromsc();
    }

    update(deltaTime: number) {
        this.updateFunc(this.instance, deltaTime);
    }
}
