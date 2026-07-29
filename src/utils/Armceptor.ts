
export class Armceptor {
    // a wrapper over Memory.patchCode for easier patching <3
    static patchCode(address: NativePointer, callback: Function) {
        Memory.patchCode(address, Process.pageSize, (code) => {
            let writer = new Arm64Writer(code, { pc: address });

            callback(writer);
            writer.flush();
        });
    }

    static nop(address: NativePointer): void {
        this.patchCode(address, function (writer: Arm64Writer) {
            writer.putNop();
        });
    }

    static ret(address: NativePointer): void {
        this.patchCode(address, function (writer: Arm64Writer) {
            writer.putRet();
        });
    }

    static bytes(address: NativePointer, array: number[]): void {
        Memory.protect(address, array.length, "rw");

        address.writeByteArray(array);

        Memory.protect(address, array.length, "rx");
    }

    static jumpout(address: NativePointer, target: NativePointer): void {
        this.patchCode(address, function (writer: Arm64Writer) {
            writer.putBranchAddress(target);
        });
    }
}