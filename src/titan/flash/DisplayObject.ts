import {Libg} from "../../libs/Libg";

const xOffset = 32;
const yOffset = 36;

const scaleXOffset = 16;
const scaleYOffset = 28;

const getWidthVtableOffset = 12 * Process.pointerSize;
const getHeightVtableOffset = 13 * Process.pointerSize;

const DisplayObject_setAlpha = new NativeFunction(
    Libg.offset(0xA492AC, 0x9A668C), 'void', [ 'pointer', 'float' ]
)

const DisplayObject_setAddColor = new NativeFunction(
    Libg.offset(0xA4925C, 0x9A6624), 'void', [ 'pointer', 'float', 'float', 'float' ]
)

const DisplayObject_setMulColor = new NativeFunction(
    Libg.offset(0xA491D8, 0x9A65B4), 'void', [ 'pointer', 'float', 'float', 'float' ]
)

const DisplayObject_setWidth = new NativeFunction(
    Libg.offset(0xA499A8, 0x9A6D9C), 'void', [ 'pointer', 'float' ]
)

const DisplayObject_setHeight = new NativeFunction(
    Libg.offset(0xA4995C, 0x9A6D54), 'void', [ 'pointer', 'float' ]
)

export class DisplayObject {
    instance: NativePointer
    vtable: NativePointer

    constructor(instance: NativePointer) {
        this.instance = instance;
        this.vtable = this.instance.readPointer();
    }

    hide(): void {
        this.visibility = false;
    }

    show(): void {
        this.visibility = true;
    }

    getHeight(): number {
        return new NativeFunction(this.vtable.add(getHeightVtableOffset).readPointer(), 'float', ['pointer'])(this.instance);
    }

    getWidth(): number {
        return new NativeFunction(this.vtable.add(getWidthVtableOffset).readPointer(), 'float', ['pointer'])(this.instance);
    }

    setWidth(width: number) {
        return DisplayObject_setWidth(this.instance, width)
    }

    setHeight(height: number) {
        return DisplayObject_setHeight(this.instance, height)
    }

    get x(): number {
        return this.instance.add(xOffset).readFloat();
    }

    get y(): number {
        return this.instance.add(yOffset).readFloat();
    }

    set x(value: number) {
        this.instance.add(xOffset).writeFloat(value);
    }

    set y(value: number) {
        this.instance.add(yOffset).writeFloat(value);
    }

    setScale(scale: number) {
        this.instance.add(scaleXOffset).writeFloat(scale);
        this.instance.add(scaleYOffset).writeFloat(scale);
    }

    getScale() {
        return this.instance.add(scaleXOffset).readFloat()
    }

    setPixelSnappedXY(x: number, y: number) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    setXY(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get visibility(): boolean {
        return Boolean(this.instance.add(Process.pointerSize).readU8());
    }

    set visibility(state: boolean) {
        this.instance.add(Process.pointerSize).writeU8(+state)
    }

    set alpha(value: number) {
        DisplayObject.setAlpha(this.instance, value);
    }

    static setAddColor(self: NativePointer, r: number, g: number, b: number) {
        DisplayObject_setAddColor(self, r, g, b);
    }

    static setMulColor(self: NativePointer, r: number, g: number, b: number) {
        DisplayObject_setMulColor(self, r, g, b);
    }

    static setAlpha(self: NativePointer, alpha: number) {
        DisplayObject_setAlpha(self, alpha);
    }
}
