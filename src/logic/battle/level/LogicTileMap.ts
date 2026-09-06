
const mapWidthOffset = 196; // 208?
const mapHeightOffset = 200;

export class LogicTileMap {
    private readonly instance: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
    }

    getMapHeight(): number {
        return this.instance.add(mapHeightOffset).readInt();
    }

    getMapWidth(): number {
        return this.instance.add(mapWidthOffset).readInt();
    }
}
