import {Libc} from "../libs/Libc";
import {LogicVersion} from "../logic/LogicVersion";
import ObjC from "frida-objc-bridge";

export class PackageInfo {
    static getPackageName(): string | null {
        let fd = Libc.open("/proc/self/cmdline", 0, "r");
        if (fd != -1) {
            let buffer = Libc.malloc(256);
            Libc.read(fd, buffer, 256);
            Libc.close(fd);
            return buffer.readUtf8String();
        }

        return null;
    }

    static getValue(key: string) {
        if (!ObjC.available) {
            console.error("[PackageInfo]", "getValue:", "ObjC.available is false!!");
            return null;
        }

        const mainBundle = ObjC.classes.NSBundle.mainBundle();
        const infoDict = mainBundle.infoDictionary();

        const keyString = ObjC.classes.NSString.stringWithString_(key);
        const value = infoDict.objectForKey_(keyString);

        return value ? value : null;
    }

    static getBundleIdentifier(): string {
        if (ObjC.available) {
            const mainBundle = ObjC.classes.NSBundle.mainBundle();
            return mainBundle.bundleIdentifier();
        } else {
            console.error("Objective-C runtime is not available!");
            return "com.supercell.laser";
        }
    }
}
