import {Libc} from "./libs/Libc";
import {LogicDefines} from "./LogicDefines";
import {ServerConnection} from "./laser/client/network/ServerConnection";
import {MessageManager} from "./laser/client/network/MessageManager";
import {LogicVersion} from "./logic/LogicVersion";
import {AllianceManager} from "./logic/alliance/AllianceManager";
import {PackageInfo} from "./utils/PackageInfo";
import {Debug} from "./gene/Debug";
import {GameMain} from "./laser/client/GameMain";
import {HomePage} from "./logic/home/HomePage";
import {FramerateManager} from "./titan/client/FramerateManager";
import {ChatCommandHandler} from "./gene/features/ChatCommandHandler";
import {BattleScreen} from "./logic/battle/BattleScreen";
import {LogicClientAvatar} from "./logic/avatar/LogicClientAvatar";
import {LogicClientHome} from "./logic/home/LogicClientHome";
import {StringTable} from "./logic/data/StringTable";
import {LogicData} from "./logic/data/LogicData";
import {LocalizationManager} from "./gene/localization/index";
import {LogicLaserMessageFactory} from "./logic/message/LogicLaserMessageFactory";
import {ClientInputManager} from "./logic/battle/ClientInputManager";
import {UsefulInfo} from "./gene/features/UsefulInfo";
import {HashTagCodeGenerator} from "./titan/logic/util/HashTagCodeGenerator";
import {HomeMode} from "./logic/home/HomeMode";
import {LatencyManager} from "./laser/client/network/LatencyManager";
import {Configuration} from "./gene/Configuration";
import {SCString} from "./titan/utils/SCString";
import {NativeFont} from "./titan/client/common/NativeFont";
import {MapEditorModifierPopup} from "./laser/client/popups/MapEditorModifierPopup";
import {AllianceHeaderEntry} from "./logic/alliance/AllianceHeaderEntry";
import {AllianceMemberEntry} from "./logic/alliance/AllianceMemberEntry";
import {PlayerProfile} from "./logic/home/PlayerProfile";
import {BattleLogPlayerEntry} from "./logic/battle/BattleLogPlayerEntry";
import {FriendEntry} from "./logic/home/FriendEntry";
import {LogicPlayer} from "./logic/battle/LogicPlayer";
import {TeamMemberEntry} from "./logic/home/team/TeamMemberEntry";
import {BattleEndPopup} from "./logic/battle/BattleEndPopup";
import {LogicDataTables} from "./logic/data/LogicDataTables";
import {Application} from "./titan/utils/Application";
import {PlayerInfo} from "./logic/home/PlayerInfo";
import {AllianceInfo} from "./logic/alliance/AllianceInfo";
import {HomeScreen} from "./logic/home/HomeScreen";
import {Libg} from "./libs/Libg";
import {LogicCharacterData} from "./logic/data/LogicCharacterData";
import {CombatHUD} from "./logic/battle/CombatHUD";
import {Character} from "./logic/battle/objects/Character";
import {TeamManager} from "./logic/home/team/TeamManager";
import {ContextMenu} from "./titan/flash/gui/ContextMenu";
import {GeneAssets} from "./gene/GeneAssets";
import {GUI} from "./titan/flash/gui/GUI";
import {DataIcon} from "./titan/flash/DataIcon";
import {GradientNickname} from "./gene/features/GradientNickname";
import {LogicBattleModeClient} from "./logic/battle/LogicBattleModeClient";

// global stuff
declare global {
    interface String {
        scptr: () => NativePointer;
        ptr: () => NativePointer;
        removeColorCodes: () => string;
        format: (...args: any[]) => string;
    }
    interface NativePointer {
        fromsc: () => string;
        accountId: () => number[];
        scptr: (str: string) => void;
    }
}

String.prototype.format = function (...args: any[]): string {
    let formattedText = this;

    args.forEach((arg, index) => {
        formattedText = formattedText.replace(`{${index}}`, arg);
    });

    return formattedText as string;
};

String.prototype.scptr = function (): NativePointer {
    let ptr = Libc.malloc(16);
    SCString.ctor(ptr, this.ptr());
    return ptr;
};

String.prototype.ptr = function (): NativePointer {
    return Memory.allocUtf8String(this as string);
};

String.prototype.removeColorCodes = function (): string {
    return this.replace(/<c[^>]+>|<\/c>/g, '');
};

NativePointer.prototype.fromsc = function (): string {
    let stringPtr = this.add(4).readInt() >= 8 ? this.add(8).readPointer() : this.add(8);

    return stringPtr.readUtf8String()!;
};

NativePointer.prototype.scptr = function (str: string) {
    SCString.ctor(this, str.ptr());
};

NativePointer.prototype.accountId = function (): number[] {
    return [
        this.readInt(),
        this.add(4).readInt()
    ];
};

// script start
function printInfo() {
    console.log("Gene Brawl", LogicVersion.toString());
    console.log("Frida:", Frida.version);
    console.log("Platform:", LogicDefines.toString());
    console.log("Device: " + Application.getDeviceType());
    console.log("System version: " + Application.getSystemVersion());
    if (LogicDefines.isPlatformIOS())
        console.log("iOS version: " + LogicVersion.iosVersion);
}

function setupNetwork() {
    ServerConnection.setupMessaging();
    MessageManager.patch();
    LogicLaserMessageFactory.patch();
    LatencyManager.patch();
}

function setupCustomAssets() {
    if (!Debug.isGeneAssetsPreloaded) {
        try {
            GeneAssets.init();
        } catch (e) {

        }
        Debug.isGeneAssetsPreloaded = true;
    }
}

function setupAvatarHooks() {
    LogicClientAvatar.patch();
}

function setupHomeHooks() {
    LogicClientHome.patch();
    HomeMode.patch();
    PlayerProfile.patch();
    FriendEntry.patch();
    PlayerInfo.patch();
    HomePage.patch();
    HomeScreen.patch();
}

function setupAllianceHooks() {
    ChatCommandHandler.patch();
    AllianceManager.patch();
    AllianceInfo.patch();
    AllianceHeaderEntry.patch();
    AllianceMemberEntry.patch();
}

function setupGame() {
    FramerateManager.patch();
    LogicVersion.patch();
    GameMain.patch();

    StringTable.patch();
    LocalizationManager.loadLocalization("EN");

    LogicData.patch();
    LogicDataTables.patch();
    GradientNickname.patchGradients();

    HashTagCodeGenerator.patch();

    NativeFont.patch();
    GUI.patch();
}

function setupBattleHooks() {
    ClientInputManager.patch();
    BattleScreen.patch();
    CombatHUD.patch();

    MapEditorModifierPopup.patch();
    DataIcon.patch()

    BattleEndPopup.patch();
    BattleLogPlayerEntry.patch();
    LogicPlayer.patch();
    Character.patch()

    LogicCharacterData.patch();
    LogicBattleModeClient.patch();
}

function setupTeamHooks() {
    TeamMemberEntry.patch();
    TeamManager.patch();
    ContextMenu.patch();
}

function initErrorHandler() {
    /// #if DEBUG
    const prepareStack = Error.prepareStackTrace;

    Error.prepareStackTrace = (err, trace) => {
        if (prepareStack) {
            const stack = prepareStack(err, trace);
            console.error(stack);
            return stack;
        } else {
            const fallback = err.stack!;
            console.error(fallback);
            return fallback;
        }
    };

    Process.setExceptionHandler((trace) => {
        console.error(trace.address.sub(Libg.begin));
        console.error(new Error(JSON.stringify(trace)));
    })
    /// #endif
}

rpc.exports.init = function (stage, parameters) {
    try {
        /// #if DEBUG
        initErrorHandler();
        /// #endif

        if (LogicDefines.isPlatformIOS()) {
            LogicVersion.iosVersion = PackageInfo.getValue("GENE_BRAWL_IOS_VERSION") ?? 0;
        }

        printInfo();

        Configuration.load();

        setupGame();
        setupCustomAssets();
        setupNetwork();
        setupAllianceHooks();
        setupAvatarHooks();
        setupHomeHooks();
        setupBattleHooks();
        setupTeamHooks();

        UsefulInfo.sessionStartedTime = Date.now();
    } catch (e: any) {
        console.log(e.stack);
    }
};
