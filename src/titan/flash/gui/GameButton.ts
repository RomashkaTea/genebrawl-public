import {CustomButton} from "./CustomButton";
import {Libg} from "../../../libs/Libg";
import {Libc} from "../../../libs/Libc";
import {MovieClip} from "../MovieClip";

// field offsets
const setTextVtableOffset = 53 * Process.pointerSize;

// function offsets
const GameButton_GameButton = new NativeFunction( // "GameButton::createButton: cannot find child by name: ", function after malloc
    Libg.offset(0x4BFDD0, 0xA95D8), 'void', ['pointer']
);

const movieClipOffset = 96;

export class GameButton extends CustomButton {
    constructor(ptr?: NativePointer) {
        if (!ptr) {
            ptr = Libc.malloc(524);
            GameButton_GameButton(ptr);
        }

        super(ptr);
    }

    getText(): string {
        const textField = this.getMovieClip().getTextFieldByName("Text");

        return textField!.getStringObject();
    }

    getTextString(): string {
        return this.instance.add(490).readPointer().fromsc();
    }

    getMovieClip() {
        return new MovieClip(
            this.instance.add(movieClipOffset).readPointer()
        );
    }

    getCheckbox() {
        return this.instance.add(508).readPointer();
    }

    getOriginalName(): string {
        return this.instance.add(516).readPointer().fromsc();
    }

    switchCheckbox(state: boolean) {
        if (this.getCheckbox().isNull()) {
            console.warn("GameButton.switchCheckbox:", "Checkbox is NULL!");
            return;
        }

        const intState = state ? 0 : 1;

        this.getCheckbox().add(Process.pointerSize).writeU8(intState);
    }

    static switchCheckbox(self: NativePointer, state: boolean) {
        const intState = state ? 0 : 1;

        self.add(508).readPointer().add(Process.pointerSize).writeU8(intState);
    }

    setText(txt: string): void {
        const setTextVtableAddress = this.vtable.add(setTextVtableOffset).readPointer();

        new NativeFunction(setTextVtableAddress, 'void', ['pointer', 'pointer', 'bool'])(this.instance, txt.scptr(), 1);
    }

    setCheckbox(instance: NativePointer): void {
        this.instance.add(508).writePointer(instance);
    }

    setOriginalName(name: string): void {
        this.instance.add(516).writePointer(name.scptr());
    }
}
