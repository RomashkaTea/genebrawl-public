
export const dataOffset = 16;

const xOffset = 48;
const yOffset = 52;

export class LogicGameObjectClient {
    instance: NativePointer;
    protected vtable: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
        this.vtable = this.instance.readPointer();
    }

    add(offset: number): NativePointer {
        return this.instance.add(offset);
    }

    static getX(self: NativePointer): number {
        return self.add(xOffset).readInt();
    }

    static getY(self: NativePointer): number {
        return self.add(yOffset).readInt();
    }
}
