const PROP_VALUE_MAX = 256;

export class Libc {
    static _open = new NativeFunction(Module.getGlobalExportByName("open")!, 'int', ['pointer', 'int', 'int']);
    static _system_property_get: NativeFunction<number, [NativePointerValue, NativePointerValue]> | null = null;
    static _remove = new NativeFunction(Module.getGlobalExportByName('remove')!, 'int', ['pointer']);
    static _mkdir = new NativeFunction(Module.getGlobalExportByName('mkdir')!, 'int', ['pointer', 'int']);
    static _chmod = new NativeFunction(Module.getGlobalExportByName('chmod')!, 'int', ['pointer', 'int']);
    static _access = new NativeFunction(Module.getGlobalExportByName('access')!, 'int', ['pointer', 'int']);
    static _opendir = new NativeFunction(Module.getGlobalExportByName('opendir')!, 'pointer', ['pointer']);
    static _sysctlbyname: NativeFunction<number, [NativePointerValue, NativePointerValue, NativePointerValue, NativePointerValue, number]> | null = null;
    static getaddrinfo = new NativeFunction(Module.getGlobalExportByName("getaddrinfo")!, 'int', ['pointer', 'pointer', 'pointer', 'pointer']);
    static close = new NativeFunction(Module.getGlobalExportByName("close")!, 'void', ['int']);
    static free = new NativeFunction(Module.getGlobalExportByName("free")!, 'void', ['pointer']);
    static malloc = new NativeFunction(Module.getGlobalExportByName("malloc")!, 'pointer', ['uint']);

    static open(pathname: string, flags: number, mode: string): number {
        let modes: { [name: string]: number; } = {
            "r": 0
        };

        return this._open(pathname.ptr(), flags, modes[mode]!);
    }

    static read = new NativeFunction(Module.getGlobalExportByName("read")!, 'int', ['int', 'pointer', 'int']);

    static getSystemProperty(prop: string): string {
        if (!this._system_property_get) {
            let exportPtr = Module.getGlobalExportByName("__system_property_get");
            if (!exportPtr) return "";
            this._system_property_get = new NativeFunction(exportPtr, 'int', ['pointer', 'pointer']);
        }

        let value = this.malloc(PROP_VALUE_MAX);

        this._system_property_get!(prop.ptr(), value);

        let result = value.readUtf8String();

        this.free(value);

        return result!;
    }

    static sysctlbyname(name: string): string {
        if (!this._sysctlbyname) {
            let exportPtr = Module.getGlobalExportByName("sysctlbyname");
            if (!exportPtr) return "";
            this._sysctlbyname = new NativeFunction(exportPtr, 'int', ['pointer', 'pointer', 'pointer', 'pointer', 'int']);
        }

        let value = this.malloc(PROP_VALUE_MAX);
        let lengthPtr = this.malloc(4);
        lengthPtr.writeInt(PROP_VALUE_MAX);

        let resultStr = "";

        let result = this._sysctlbyname(name.ptr(), value, lengthPtr, NULL, 0);
        if (result != -1) {
            resultStr = value.readUtf8String()!;
        }

        this.free(value);
        this.free(lengthPtr);

        return resultStr;
    }

    static opendir(dir: string) {
        return this._opendir(dir.ptr());
    }

    static readdir = new NativeFunction(Module.getGlobalExportByName('readdir')!, 'pointer', ['pointer']);
    static closedir = new NativeFunction(Module.getGlobalExportByName('closedir')!, 'int', ['pointer']);

    static remove(dir: string) {
        return this._remove(dir.ptr());
    }

    static mkdir(dir: string, mode?: number) { // 0o777
        if (mode) {
            this._mkdir(dir.ptr(), mode);
            return;
        }

        this._mkdir(dir.ptr(), 0o777);
    }

    static chmod(dir: string, mode: number = 0o777) {
        this._chmod(dir.ptr(), mode);
    }

    static access(dir: string) {
        return this._access(dir.ptr(), 0);
    }

    static memset = new NativeFunction(Module.getGlobalExportByName('memset')!, 'void', ['pointer', 'int', 'int']);
}