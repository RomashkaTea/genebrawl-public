import {Libc} from "../../../libs/Libc";
import {Path} from "../../../titan/Path";

type FileData = ArrayBuffer | string | Uint8Array;

export class Filesystem {
    static writeToFile(path: string, data: FileData) {
        try {
            if (data instanceof Uint8Array) {
                data = data.buffer as ArrayBuffer;
            }

            const splitPath = path.split("/");
            Filesystem.createDirectoryIfNotExist(Path.getUpdatePath() + splitPath[splitPath.length - 2] + "/");

            const file = new File(path, "w");

            file.write(data);

            file.close();
        } catch (e) {
            console.error(e);
        }
    }

    static doesFileExist(path: string) {
        return Libc.access(path) !== -1;
    }

    static createDirectoryIfNotExist(path: string) {
        const directories = path.split("/");

        for (let i = 0; i < directories.length; i++) {
            const mergedPath = directories.slice(0, i).join("/");
            if (mergedPath.length === 0) continue;
            if (Libc.access(mergedPath) === -1) {
                Path.mkdir(mergedPath);
            }
        }
    }
}
