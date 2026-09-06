

const encodeVtableOffset = 2 * Process.pointerSize;
const decodeVtableOffset = 3 * Process.pointerSize;
const getServiceNodeTypeOffset = 4 * Process.pointerSize;
export const getMessageTypeVtableOffset = 5 * Process.pointerSize;
const byteStreamOffset = Process.pointerSize;
const messageVersionOffset = 136;

export class PiranhaMessage {
    instance: NativePointer;
    protected vtable: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
        this.vtable = this.instance.readPointer();
    }

    encode() {
        new NativeFunction(this.vtable.add(encodeVtableOffset).readPointer(), 'void', ['pointer'])(this.instance);
    }

    decode() {
        new NativeFunction(this.vtable.add(decodeVtableOffset).readPointer(), 'void', ['pointer'])(this.instance);
    }

    getServiceNodeType(): number {
        return new NativeFunction(this.vtable.add(getServiceNodeTypeOffset).readPointer(), 'int', [])();
    }

    getMessageType(): number {
        return PiranhaMessage.getMessageType(this.instance);
    }

    getMessageVersion(): number {
        return this.instance.add(messageVersionOffset).readInt();
    }

    static getMessageType(self: NativePointer): number {
        return new NativeFunction(self.readPointer().add(getMessageTypeVtableOffset).readPointer(), 'int', [])();
    }
}
