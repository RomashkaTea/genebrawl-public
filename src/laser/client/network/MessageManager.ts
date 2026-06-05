import {Debug} from "../../../gene/Debug";
import {Libg} from "../../../libs/Libg";
import {PiranhaMessage} from "../../../logic/message/PiranhaMessage";
import {LoginFailedMessage} from "../../../logic/message/account/LoginFailedMessage";
import {LogicLaserMessageFactory} from "../../../logic/message/LogicLaserMessageFactory";
import {Configuration} from "../../../gene/Configuration";
import {OwnHomeDataMessage} from "../../../logic/message/home/OwnHomeDataMessage";
import {LoginOkMessage} from "../../../logic/message/account/LoginOkMessage";
import {StringTable} from "../../../logic/data/StringTable";
import {LocalizationManager} from "../../../gene/localization/index";
import {BattleEndMessage} from "../../../logic/message/battle/BattleEndMessage";
import {PlayAgainMessage} from "../../../logic/message/battle/PlayAgainMessage";
import {LatencyData} from "../../../logic/latency/LatencyData";
import {LatencyManager} from "./LatencyManager";
import {UdpConnectionInfoMessage} from "../../../logic/message/udp/UdpConnectionInfoMessage";
import {LogicVersion} from "../../../logic/LogicVersion";
import {StartLoadingMessage} from "../../../logic/message/battle/StartLoadingMessage";
import {UsefulInfo} from "../../../gene/features/UsefulInfo";
import {Libc} from "../../../libs/Libc";
import {BattleMode} from "../../../logic/battle/BattleMode";
import {GameMain} from "../GameMain";
import {GUI} from "../../../titan/flash/gui/GUI";
import {PlayerProfileMessage} from "../../../logic/message/home/PlayerProfileMessage";
import {BattleProfile} from "../../../utils/BattleProfile";
import {LogicDataTables} from "../../../logic/data/LogicDataTables";
import {EDebugCategory} from "../../../gene/debug/DebugMenuCategory";
import {TeamStreamMessage} from "../../../logic/message/team/TeamStreamMessage";

const updateUrl = "https://t.me/gene_land";

const MessageManager_instance = Libg.offset(0x103DE60, 0xEE62E0); // "Unable to send analytics event! MessageManager == NULL!"

const MessageManager_sendMessageOffset = 24;
const latencyTestsCountOffset = 404;
const latencyTestsOffset = 392;

const MessageManager_receiveMessage = new NativeFunction( // "BrawlTvManager processed msg of type %d"
    Libg.offset(0x68F6C4, 0x232A54), 'bool', ['pointer', 'pointer']
);

export class MessageManager {
    static accountInfo: string;
    static accountId: NativePointer;
    static ownPlayerTeam: number = -1;
    static pendingProfiles: BattleProfile[] = [];

    static getInstance(): NativePointer {
        return MessageManager_instance.readPointer();
    }

    static getVtable(): NativePointer {
        return this.getInstance().readPointer();
    }

    static patch() {
        Interceptor.attach(MessageManager_receiveMessage, function () {
            let message = (this.context as Arm64CpuContext).x1;
            let piranhaMessage = LogicLaserMessageFactory.createMessageByType(message);

            MessageManager.receiveMessage(piranhaMessage);
        });
    }

    static getLatencyTests(): LatencyData[] {
        let instance = this.getInstance();
        let count = instance.add(latencyTestsCountOffset).readInt();
        let arrayPtr = instance.add(latencyTestsOffset).readPointer();

        let latencyDatas = [];

        for (let i = 0; i < count; i++) {
            latencyDatas.push(
                new LatencyData(arrayPtr.add(Process.pointerSize * i).readPointer())
            );
        }

        return latencyDatas;
    }

    static getLatencyTestsCount(): number {
        return this.getInstance().add(latencyTestsCountOffset).readInt();
    }

    private static onLoginFailedMessageReceived(message: LoginFailedMessage) {
        let errorCode = message.getErrorCode();

        console.log(`Login failed (error code ${errorCode})`);

        switch (errorCode) {
            case 1: // Account not found
            case 2: // Wrong shard
                message.setUnknown(1); // so the keychain will be wiped
                break;
            case 8: // Update is available
                if (Configuration.useStage) {
                    message.setErrorCode(31);
                    message.setUpdateURL(updateUrl);
                    message.setReason(LocalizationManager.getString("STAGE_SERVER_UPDATED"));

                    Configuration.useStage = false;
                    Configuration.save();
                }
                else {
                    message.setReason(LocalizationManager.getString("PROD_SERVER_UPDATED"));
                    message.setUpdateURL(updateUrl);
                }
                break;
            case 30:
                if (!Configuration.useProxy) {
                    Configuration.useProxy = true;
                    Configuration.save();

                    message.setErrorCode(9);
                    message.setRedirectDomain("proxy.hpdevfox.ru");
                }
                else {
                    if (Configuration.useStage) {
                        message.setReason(LocalizationManager.getString("STAGE_SERVER_REQUIRES_VPN"));

                        Configuration.useStage = false;
                        Configuration.save();

                        return;
                    }

                    message.setReason(LocalizationManager.getString("PROXY_ERROR"));
                }
                break;
        }
    }

    private static onLoginOkMessageReceived(message: LoginOkMessage) {
        try {
            console.log(`Logged in! (account id ${message.getAccountId().join('-')}, server env ${message.getServerEnvironment()})`);

            this.accountInfo =
                `Account ID: ${message.getAccountId().join("-")}
Server Version: ${message.getServerVersion()}
Server Environment: ${message.getServerEnvironment()}
Session Count: ${message.getSessionCount()}
Playtime: ${message.getPlaytimeSeconds()}
Days since started playing: ${message.getDaysSinceStartedPlaying()}
Account tier: ${message.getAccountTier()}
`;
            let accountId = message.getAccountId();

            this.accountId = Libc.malloc(8);

            this.accountId.writeInt(accountId[0]);
            this.accountId.add(4).writeInt(accountId[1]);
        }
        catch (e) {

        }

        let languageCode = StringTable.getCurrentLanguageCode();

        if (!languageCode)
            languageCode = "EN";

        LocalizationManager.loadLocalization(languageCode);
        LocalizationManager.buildChangelogs();

        Debug.addResourcesToLoad();
        Debug.create();

        if (!Configuration.showDebugItems) {
            Debug.getDebugButton().hide();
            Debug.getDebugMenu().hide();
        }
    }

    private static onOwnHomeDataMessageReceived(message: OwnHomeDataMessage) {
        BattleMode.xrayTargetGlobalId = -1;
        BattleMode.xrayTargetPlayerIndex = -1;

        this.ownPlayerTeam = -1;
        UsefulInfo.setBattleInfo("");
        UsefulInfo.setBattlePing(-1);
        MessageManager.pendingProfiles = [];

        if (!LogicVersion.areNewFeaturesAllowed(0))
            setTimeout(() => GUI.showFloaterText(LocalizationManager.getString("IOS_TOO_OLD")), 4000);

        if (Configuration.antiOutOfSync)
            setTimeout(() => GUI.showFloaterText(LocalizationManager.getString("ANTI_OUT_OF_SYNC")), 2000);

        GameMain.setSlowMode(Configuration.slowMode);

        let confData = message.getConfData();
        if (Configuration.themeId != -1 || Configuration.staticBackground) {
            for (let i = 0; i < confData.add(228).readInt(); i++) {
                let ptr = confData.add(216).readPointer().add(Process.pointerSize * i).readPointer();
                Libc.free(ptr);
            }

            Libc.free(confData.add(216).readPointer());

            confData.add(216).writePointer(NULL);
            confData.add(228).writeInt(0);
        }

        if (Configuration.regionId != -1) {
            LatencyManager.selectedRegionId = Configuration.regionId;
            LatencyManager.triggerLatencyTest(Configuration.regionId);
        }

        LogicDataTables.patchClientGlobals();

        message.getClientAvatar().changeNameIfDeveloper();
    }

    private static onUdpConnectionInfoMessageReceived(message: UdpConnectionInfoMessage) {
        console.log("UDP server: " + message.getServerIp() + ":" + message.getServerPort());
        Configuration.udpConnectionAddress = message.getServerIp() + ":" + message.getServerPort();

        return true;
    }

    private static receiveMessage(message: PiranhaMessage) {
        const messageType = message.getMessageType();

        //if (LogicVersion.isDeveloperBuild())
        //    console.log("receiveMessage: " + messageType);

        switch (messageType) {
            case 20103:
                this.onLoginFailedMessageReceived(message as LoginFailedMessage);
                break;
            case 20104:
                this.onLoginOkMessageReceived(message as LoginOkMessage);
                break;
            case 20559:
                this.onStartLoadingMessageReceived(message as StartLoadingMessage);
                break;
            case 23456:
                this.onBattleEndMessageReceived(message as BattleEndMessage);
                break;
            case 24101:
                this.onOwnHomeDataMessageReceived(message as OwnHomeDataMessage);
                break;
            case 24112:
                this.onUdpConnectionInfoMessageReceived(message as UdpConnectionInfoMessage);
                break;
            case 24113:
                this.onPlayerProfileMessageReceived(message as PlayerProfileMessage);
                break;
            case 24131:
                this.onTeamStreamMessageReceived(message as TeamStreamMessage);
                break;
        }
    }

    private static onBattleEndMessageReceived(message: BattleEndMessage) {
        BattleMode.xrayTargetGlobalId = -1;
        BattleMode.xrayTargetPlayerIndex = -1;

        Debug.getDebugMenu()?.removeCategory(EDebugCategory.XRAY);

        this.ownPlayerTeam = -1;
        UsefulInfo.setBattleInfo("");
        UsefulInfo.setBattlePing(-1);
        MessageManager.pendingProfiles = [];

        const status = message.getPlayAgainStatus();
        if (!status.isNull() && !message.getPlayAgainStatus().isNull() && Configuration.autoPlayAgain)
            MessageManager.sendMessage(new PlayAgainMessage(true));
    }

    public static sendMessage(message: PiranhaMessage) {
        new NativeFunction(this.getVtable().add(MessageManager_sendMessageOffset).readPointer(), 'void', ['pointer', 'pointer'])(this.getInstance(), message.instance);
    }

    public static receive(message: PiranhaMessage) {
        new NativeFunction(MessageManager_receiveMessage, 'void', ['pointer', 'pointer'])(this.getInstance(), message.instance);
    }

    static hexToByteArray(hexString: string) {
        if (hexString.length % 2 !== 0) {
            throw new Error("Invalid hex string");
        }

        const byteArray = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i += 2) {
            byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }
        return byteArray;
    }

    static uint8ArrayToPointer(uint8Array: Uint8Array) {
        const arrayBuffer = uint8Array.buffer instanceof ArrayBuffer ? uint8Array.buffer : new ArrayBuffer(uint8Array.length);
        const pointer = Libc.malloc(arrayBuffer.byteLength);
        pointer.writeByteArray(arrayBuffer);
        return pointer;
    }

    private static onStartLoadingMessageReceived(message: StartLoadingMessage) {
        this.ownPlayerTeam = message.getOwnPlayerTeam();

        let info = "";
        let isBotMatch = Configuration.showBotPrefix;
        let playersArray = message.getPlayersArray();

        let firstTeamAvatarId: number[] = [];

        for (const player of playersArray) {
            if (firstTeamAvatarId.length == 0) {
                if (player.isOwnPlayerTeam(this.ownPlayerTeam)) {
                    firstTeamAvatarId = player.getAvatarId();
                }
            }

            if (!player.isOwnPlayerTeam(message.getOwnPlayerTeam())) {
                isBotMatch = isBotMatch
                    ? (player.getAvatarId()[0] == firstTeamAvatarId[0] && player.getAvatarId()[1] < firstTeamAvatarId[1])
                    : false;
            }

            if (player.isBot()) isBotMatch = false;

            if (!player.isBot()) {
                // MessageManager.addPendingProfile(new BattleProfile(player.getAvatarId(), player.getCharacterGlobalId(), player.instance));
            }

            info += player.toString() + "\n";
        }

        if (isBotMatch && Configuration.showBotPrefix) {
            console.log("BOT MATCH!");

            for (const player of playersArray) {
                if (player.isOwnPlayerTeam(this.ownPlayerTeam)) continue;

                player.setName(`<c3>[BOT]</c> ${player.getName()}`);
            }
        }


        if (LogicVersion.isDeveloperBuild()) {
            Debug.getDebugMenu().createDebugMenuButton("Disable X-Ray", -1, -1, 0, EDebugCategory.XRAY);

            for (const player of playersArray) {
                let teamIndex = player.getTeamIndex();

                if (message.getOwnPlayerTeam() != teamIndex &&
                    message.getOwnPlayerIndex() != player.getPlayerIndex()) {
                    Debug.getDebugMenu().createDebugMenuButton(playersArray.indexOf(player) + ". " + player.getName(), -1, -1, 0, EDebugCategory.XRAY);

                    console.log("MessageManager.onStartLoadingMessageReceived:", "X-Ray target", player.getName(), "added!");
                }

                Debug.getDebugMenu().needToUpdateLayout();
            }
        }

        // console.log(info)

        UsefulInfo.setBattleInfo(info);
    }

    private static onPlayerProfileMessageReceived(message: PlayerProfileMessage) {
        const playerProfile = message.getPlayerProfile();

        const pendingProfile = MessageManager.getPendingProfile(playerProfile.getPlayerId());
        if (pendingProfile) {

        }
    }

    private static onTeamStreamMessageReceived(message: TeamStreamMessage) {
        const streamLength = message.getStreamLength();

        if (streamLength > 1) return;
    }

    private static getPendingProfile(playerId: number[]): BattleProfile | null {
        for (const pendingProfile in MessageManager.pendingProfiles) {
            const battleProfile = MessageManager.pendingProfiles[pendingProfile];

            const id: number[] = battleProfile.playerId;

            if (id[0] == playerId[0] && id[1] == playerId[1]) {
                return battleProfile;
            }
        }

        return null;
    }
}
