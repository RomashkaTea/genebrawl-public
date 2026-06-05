import {Path} from "../titan/Path";
import {Constants} from "./Constants";
import {NCoder} from "./networking/NetworkManager";

const DO_NOT_SAVE_KEYS = [
    "isChinaVersion",
    "braille", "braille_textfield"
];

export class Configuration {
    // static [name]: [type] = [defaultValue (optional)]
    static useProxy: boolean;
    static useStage: boolean;

    static key: string;
    static validKey: string = Constants.UNAVAILABLE_KEY_STRING;
    static nonce: string;

    static showSidemask: boolean = true;
    static emoteAnimation: boolean = true;
    static drawOutline: boolean = true;
    static showDebugItems: boolean = true;
    static showLobbyInfo: boolean = true;
    static contentCreatorBoost: boolean = true;
    static specialOffers: boolean = true;
    static heroSounds: boolean = true;
    static showUlti: boolean = true;
    static showName: boolean = true;
    static showTags: boolean = true;
    static showBotPrefix: boolean = false;

    static fakePremiumPass: boolean;
    static showFutureEvents: boolean;
    static slowMode: boolean;
    static staticBackground: boolean;
    static showConnectionIndicator: boolean;
    static darkTheme: boolean;
    static isChinaVersion: boolean;
    static antiOutOfSync: boolean;
    static hideBattleState: boolean;
    static autoPlayAgain: boolean;
    static autoExitAfterBattle: boolean;
    static skipReplayIntro: boolean;
    static antiAFK: boolean;
    static moveToTarget: boolean;
    static autoAim: boolean;
    static holdToShoot: boolean;
    static autoUlti: boolean;
    static autoOvercharge: boolean;
    static autoDodge: boolean;
    static movementBasedAutoshoot: boolean;
    static skipBattleEndReplay: boolean;
    static moveToAlly: boolean;
    static themeId: number = -1;
    static themeMusicId: number = -1;
    static useLegacyThemeMode: boolean = false;
    static hideHeroesIntro: boolean = false;
    static useOldIntro: boolean = false;
    static hideLeagueBattleCard: boolean = false;
    static showEnemyAmmo: boolean = false;
    static skipRandomAnimation: boolean = false;
    static battleCammeraMode: number = 0;
    static autoReady: boolean;
    static alpha: number = 100;
    static opacity: number = 100;
    static stopLolaClone: boolean = false;
    static lolaControlState: number = 0; // 0 - both, 1 - only lola, 2 - only clone
    static kitMoveHack: boolean = false;
    static antiProfanity: boolean = false;
    static showEditControls: boolean = false;
    static showBattleShortcuts: boolean = false;
    static antiknockback: boolean = false;
    static showTicks: boolean = false;
    static enableProtective: boolean = false;

    //
    static udpConnectionAddress: string;
    static showSVOButton: boolean = false;

    static preferredStatus: number = -1;
    static lastChangelogVersionSeen: number = -1;


    // Useful Info
    static showFPS: boolean;
    static showCurrentTime: boolean;
    static showSessionTime: boolean;
    static showBattlePing: boolean;
    static showTeam: boolean;
    static showBattleInfo: boolean;
    static showChatButton: boolean;

    // Battle servers
    static regionId: number = -1;

    // Visual name
    static accountNames: { [key: string]: string; } = {};

    // Braille
    /**
     * самая лучшая фича, после добавления которой продажи вырастут на 1200%
     */
    static braille: boolean;
    static braille_textfield: boolean;

    static markFakeNinja: boolean;
    static cameraRotateY: number = 4000.0;
    static cameraY: number = 300.0;
    static cameraX: number = 0.0;
    static cameraAlign: number = 0.0;
    static cameraRotateX: number = 0.0;
    static cameraDistance: number = 0.0;
    static cameraZ: number = 0.0;

    static currentUserThemeSet: string = "";

    static snowTheme: boolean;

    static load() {
        let path = Path.getDataPath() + "settings.json";
        try {
            let json = File.readAllText(path);

            let decryptedJson = JSON.parse(NCoder.n2s(json));

            for (let key in decryptedJson) {
                (<any>this)[key] = decryptedJson[key];
            }
        } catch (e) {
            console.log(e);
        }

        Configuration.braille = false;
        Configuration.isChinaVersion = false;
        Configuration.braille_textfield = false;

        console.log("Configuration.load:", `Loaded ${Object.keys(this).length} values!`);
    }

    static writeToFile(filepath: string, mode: string, content: string) {
        let file = new File(filepath, mode);
        file.write(content);
        file.close();
    }

    static save() {
        let path = Path.getDataPath() + "settings.json";
        let json = this.toJSON();

        let encryptedJson = JSON.stringify(NCoder.s2n(json));

        this.writeToFile(path, "w", encryptedJson);

        console.log("Configuration.save:", "saved successfully!");
    }

    static toJSON(): string {
        let dictionary: { [key: string]: any; } = {};

        for (let key of Object.keys(this)) {
            if (DO_NOT_SAVE_KEYS.includes(key)) {
                //console.log("Configuration::toJSON:", `skip ${key}`);
                continue;
            }

            dictionary[key] = (<any>this)[key];
        }

        return JSON.stringify(dictionary);
    }
}
