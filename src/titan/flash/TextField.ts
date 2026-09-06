
import {RGBA} from "../../gene/features/RGBA";
import {Libg} from "../../libs/Libg";
import {DisplayObject} from "./DisplayObject";

const fontSizeOffset = 144;
const stringObjectOffset = 192;
const textColorOffset = 96;

const TextField_setText = new NativeFunction( // under "TID_GATCHA_SCREEN_TICKET_DROP_NOTE" IDK there's a lot of ways
    Libg.offset(0xA7D540, 0x9D7FE0), 'void', ['pointer', 'pointer']
);

const TextField_getTextHeight = new NativeFunction( // "TextBoxBase: Unable to find TextField with instance name %s", before what the fuck if checks
    Libg.offset(0xA7D7C8, 0x9D8254), 'float', ['pointer']
);

export class TextField extends DisplayObject {
    getFontSize(): number {
        return this.instance.add(fontSizeOffset).readInt();
    }

    setFontSize(fontSize: number): void {
        this.instance.add(fontSizeOffset).writeInt(fontSize);
    }

    setText(text: string): void {
        TextField_setText(this.instance, text.scptr());
    }

    setTextColor(color: number = RGBA.white) {
        this.instance.add(textColorOffset).writeInt(color);
    }

    getStringObject(): string {
        return this.instance.add(stringObjectOffset).fromsc();
    }

    getTextHeight() {
        return TextField_getTextHeight(this.instance);
    }
}
