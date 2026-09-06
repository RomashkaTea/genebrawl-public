import {Path} from "../titan/Path";
import {DownloadedImage} from "../titan/flash/DownloadedImage";
import {HttpClient} from "./features/HttpClient/index";
import {Filesystem} from "./features/filesystem/index";
import {LogicVersion} from "../logic/LogicVersion";
import {Application} from "../titan/utils/Application";
import {NativeDialog} from "../titan/utils/NativeDialog";
import {NativeHTTPClient} from "../titan/utils/NativeHTTPClient";
import {LogicDefines} from "../LogicDefines";

interface IAssignments {
    [key: string]: IAssignment;
}

interface IAssignment {
    path: string,
    url: string;
}

export class GeneAssets {
    static assignments: IAssignments = {};
    static loaded: string[] = [];
    static downloaded: string[] = [];

    static init() {
        GeneAssets.initAssignments();
        GeneAssets.preloadAssets();
    }

    private static initAssignments() {
        GeneAssets.createAssignment("WHEELCHAIR", {
            path: "image/wheelchair.png",
            url: "http://cloud.mysticte.ch/storage/09a66dbfbbdf14075d25fff527dee6e4a8274d614dcb6bbf/wheel.png"
        });

        GeneAssets.createAssignment("BG_GENEBRAWL", {
            path: "sc/background_genebrawl.sc",
            url: "http://cloud.mysticte.ch/storage/09a66dbfbbdf14075d25fff527dee6e4a8274d614dcb6bbf/background_genebrawl.sc"
        });

        GeneAssets.createAssignment("BG_GENEBRAWL_TEX", {
            path: "sc/background_genebrawl_tex.sc",
            url: "http://cloud.mysticte.ch/storage/09a66dbfbbdf14075d25fff527dee6e4a8274d614dcb6bbf/background_genebrawl_tex.sc"
        });

        if (LogicVersion.isDeveloperBuild())
            GeneAssets.createAssignment("CUSTOM_BG", {
                path: "image/background.png",
                url: ""
            });
    }

    private static createAssignment(name: string, data: IAssignment) {
        GeneAssets.assignments[name] = data;
    }

    private static preloadAssets() {
        for (const key in GeneAssets.assignments) {
            const file = GeneAssets.assignments[key];
            const path = Path.getUpdatePath() + file.path;
            console.log(path, Filesystem.doesFileExist(path));
            if (!Filesystem.doesFileExist(path) && file.url != "") {
                GeneAssets.downloadAsset(file.url).then((response) => {
                    if (response.getStatusCode() !== 200) {
                        console.warn("GeneAssets.preloadAssets:", "Server thrown", response.getStatusCode(), "code when tried to download", file.path, "asset. Skipping it!");
                        NativeDialog.showNativeDialog(NULL, "Error", `Failed to load ${file.path} asset from server. Status code: ${response.getStatusCode()}`, "OK");
                        return;
                    }

                    const body = response.getBody();
                    Filesystem.writeToFile(path, body);

                    console.log("GeneAssets.preloadAssets: Downloaded asset", file.path.split("/").slice(-1)[0]);

                    GeneAssets.downloaded.push(file.path);
                });
            } else {
                GeneAssets.downloaded.push(file.path);
            }
        }
    }

    static getAsset(assetName: string) {
        if (!GeneAssets.assignments[assetName]) {
            throw new Error("No image defined! Please put it into GeneAssets.createAssignment!");
        }

        const assignment = GeneAssets.assignments[assetName];

        if (GeneAssets.wasLoaded(assignment.path)) {
            console.warn("GeneAssets.getAsset:", assignment.path, "wasn't loaded successfully!");
        }

        const image = new DownloadedImage(Path.getUpdatePath() + assignment.path);

        return image;
    }

    static wasLoaded(file: string) {
        return GeneAssets.loaded.includes(file);
    }

    static wasDownloaded(file: string) {
        return GeneAssets.downloaded.includes(file);
    }

    private static downloadAsset(url: string) {
        const client = new HttpClient();

        return client.sendRequest(url, "GET", {
            'User-Agent': `Gene Brawl ${LogicVersion.scriptEnvironment.toUpperCase()}/${LogicVersion.toDebugString()} (${Application.getDeviceType()})`
        });
    }
}
