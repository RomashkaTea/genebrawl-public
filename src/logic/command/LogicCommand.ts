const executeVtableOffset = 3 * Process.pointerSize;
const getCommandTypeVtableOffset = 4 * Process.pointerSize;

export class LogicCommand {
    instance: NativePointer;
    protected vtable: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
        this.vtable = this.instance.readPointer();
    }

    execute(logicHomeMode: NativePointer): number {
        return new NativeFunction(this.vtable.add(executeVtableOffset).readPointer(), 'int', ['pointer', 'pointer', 'int', 'bool'])(this.instance, logicHomeMode, 3, 0);
    }

    getCommandType(): number {
        return LogicCommand.getCommandType(this.instance);
    }

    static getCommandType(self: NativePointer): number {
        return new NativeFunction(self.readPointer().add(getCommandTypeVtableOffset).readPointer(), 'int', ['pointer'])(self);
    }
}
