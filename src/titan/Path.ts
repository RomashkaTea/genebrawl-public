import {LogicDefines} from "../LogicDefines";
import {PackageInfo} from "../utils/PackageInfo";
import {Libg} from "../libs/Libg";
import {Libc} from "../libs/Libc";
import ObjC from "frida-objc-bridge";

const Path_mkdir = new NativeFunction(
    Libg.offset(-1, 0xBA908C), 'void', ['pointer'] // "createDirectoryAtPath:withIntermediateDirectories:attributes:error:"
);


export class Path {
    static getDataPath(): string {
        if (LogicDefines.isPlatformAndroid()) {
            return `/data/data/${PackageInfo.getPackageName()}/files/`;
        }

        return Process.getHomeDir() + "/Documents/"; // iOS
    }

    static getResourcePath(): string {
        if (ObjC.available) {
            const NSBundle = ObjC.classes.NSBundle;
            const mainBundle = NSBundle.mainBundle();
            const bundlePath = mainBundle.bundlePath().toString();

            return bundlePath + "/res/";
        } else {
            return "";
        }
    }

    static getUpdatePath(): string {
        if (LogicDefines.isPlatformAndroid()) {
            return `/data/user/0/${PackageInfo.getPackageName()}/update/`;
        }

        return Process.getHomeDir() + "/Documents/updated/"; // iOS (хлеб потом сделай пж)
    }

    static mkdir(directory: string) {
        if (LogicDefines.isPlatformIOS())
            Path_mkdir(directory.scptr());
        else
            Libc.mkdir(directory, 0o777);
    }
}
