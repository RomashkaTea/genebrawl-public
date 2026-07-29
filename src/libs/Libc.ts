
const PROP_VALUE_MAX = 256;

export class Libc {
    static getaddrinfo = new NativeFunction(Module.getGlobalExportByName("getaddrinfo")!, 'int', ['pointer', 'pointer', 'pointer', 'pointer']);
    static close = new NativeFunction(Module.getGlobalExportByName("close")!, 'void', ['int']);
    static free = new NativeFunction(Module.getGlobalExportByName("free")!, 'void', ['pointer']);
    static malloc = new NativeFunction(Module.getGlobalExportByName("malloc")!, 'pointer', ['uint']);

    static open(pathname: string, flags: number, mode: string): number {
        let modes: { [name: string]: number; } = {
            "r": 0
        };

        return new NativeFunction(Module.getGlobalExportByName("open")!, 'int', ['pointer', 'int', 'int'])(pathname.ptr(), flags, modes[mode]!);
    }

    static read = new NativeFunction(Module.getGlobalExportByName("read")!, 'int', ['int', 'pointer', 'int']);

    static getSystemProperty(prop: string): string {
        let value = this.malloc(PROP_VALUE_MAX);

        new NativeFunction(Module.getGlobalExportByName("__system_property_get")!, 'int', ['pointer', 'pointer'])(prop.ptr(), value);

        let result = value.readUtf8String();

        this.free(value);

        return result!;
    }

    static sysctlbyname(name: string): string {
        let value = this.malloc(PROP_VALUE_MAX);
        let lengthPtr = this.malloc(4);
        lengthPtr.writeInt(PROP_VALUE_MAX);

        let resultStr = "";

        let result = new NativeFunction(Module.getGlobalExportByName("sysctlbyname")!, 'int', ['pointer', 'pointer', 'pointer', 'pointer', 'int'])(name.ptr(), value, lengthPtr, NULL, 0);
        if (result != -1) {
            resultStr = value.readUtf8String()!;
        }

        this.free(value);
        this.free(lengthPtr);

        return resultStr;
    }

    static opendir(dir: string) {
        return new NativeFunction(Module.getGlobalExportByName('opendir')!, 'pointer', ['pointer'])(dir.ptr());
    }

    static readdir = new NativeFunction(Module.getGlobalExportByName('readdir')!, 'pointer', ['pointer']);
    static closedir = new NativeFunction(Module.getGlobalExportByName('closedir')!, 'int', ['pointer']);

    static remove(dir: string) {
        return new NativeFunction(Module.getGlobalExportByName('remove')!, 'int', ['pointer'])(dir.ptr());
    }

    static mkdir(dir: string, mode?: number) { // 0o777
        if (mode) {
            new NativeFunction(Module.getGlobalExportByName('mkdir')!, 'void', ['pointer', 'int'])(dir.ptr(), mode);
            return;
        }

        new NativeFunction(Module.getGlobalExportByName('mkdir')!, 'void', ['pointer'])(dir.ptr());
    }

    static chmod(dir: string, mode: number = 0o777) {
        new NativeFunction(Module.getGlobalExportByName('chmod')!, 'void', ['pointer', 'int'])(dir.ptr(), mode);
    }

    static access(dir: string) {
        return new NativeFunction(Module.getGlobalExportByName('access')!, 'int', ['pointer', 'int'])(dir.ptr(), 0);
    }

    static memset = new NativeFunction(Module.getGlobalExportByName('memset')!, 'void', ['pointer', 'int', 'int']);
}