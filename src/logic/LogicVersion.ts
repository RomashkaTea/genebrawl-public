import {Configuration} from "../gene/Configuration";
import {Libg} from "../libs/Libg";
import {LogicDefines} from "../LogicDefines";

const LogicVersion_environment = Libg.offset(0x0, 0xEE68B4);

const LogicVersion_isChinaVersion = Libg.offset(0x0, 0x39271C); // "Only global leaderboard available but fetching local" | or LogicVersion_isStage + 12
const LogicVersion_isDeveloperBuild = Libg.offset(0x0, 0x39275C); // "LATENCY TESTS" | or LogicVersion_isChinaVersion + 8

const version = LogicDefines.isPlatformAndroid() ? "62.250" : "62.258";
const scriptVersion = 87;

type ScriptEnvironment = "dev" | "prod";

export class LogicVersion {
    static readonly scriptEnvironment: ScriptEnvironment = process.env.SCRIPT_ENV as ScriptEnvironment;

    static isProd(): boolean {
        return this.scriptEnvironment == "prod";
    }

    static isDeveloperBuild(): boolean {
        return this.scriptEnvironment == 'dev';
    }
    static getScriptVersion(): number {
        return scriptVersion;
    }

    static patch() {
        this.updateEnvironment();

        Interceptor.replace(LogicVersion_isChinaVersion, new NativeCallback(function () {
            return Number(Configuration.isChinaVersion);
        }, 'bool', []));

        // for testing purposes
        Interceptor.replace(LogicVersion_isDeveloperBuild, new NativeCallback(function () {
            return 1;
        }, 'bool', []));
    }

    static updateEnvironment() {
        LogicVersion_environment.writeInt(Configuration.useStage ? 5 : 3);
    }

    static toString(): string {
        return `v${version} (script: ${scriptVersion})`;
    }

    static toDebugString(): string {
        return `${version}`; // don't add "v" prefix here
    }

    static getEnvironment(): string {
        return this.scriptEnvironment;
    }
}
