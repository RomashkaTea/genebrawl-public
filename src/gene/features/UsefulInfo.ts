import {Configuration} from "../Configuration";
import {Debug} from "../Debug";
import {DebugHudMessageCollector} from "../debug/DebugHudMessageCollector";
import {MessageManager} from "../../laser/client/network/MessageManager";
import {LocalizationManager} from "../../gene/localization/index";
import {LogicVersion} from "../../logic/LogicVersion";

export class UsefulInfo {
    private static normalizeNumber = (number: number) => number < 10 ? `0${number}` : number;
    private static battleInfo: string = "";
    private static battlePing: number = -1;
    private static secondsSinceLastUpdate: number = Math.round(new Date().getTime() / 1000);
    private static frameCounter: number = 0;

    static sessionStartedTime: number = 0;
    static projectilesAmount: number = 0;
    static ticks: number = 0;
    static disableDevBuildMessage: boolean = false;

    static getFPS() {
        return this.frameCounter;
    }

    static getCurrentTime() {
        const date = new Date();

        return `Time: ${date.getFullYear()}.${UsefulInfo.normalizeNumber(date.getMonth() + 1)}.${UsefulInfo.normalizeNumber(date.getDate())} ${UsefulInfo.normalizeNumber(date.getHours())}:${UsefulInfo.normalizeNumber(date.getMinutes())}:${UsefulInfo.normalizeNumber(date.getSeconds())}`;
    }

    static getSessionTime() {
        const currentTime = Date.now();

        const difference = Math.floor((currentTime - UsefulInfo.sessionStartedTime) / 1000);

        const seconds = difference % 60;
        const minutes = Math.floor(difference / 60) % 60;
        const hours = Math.floor(difference / 3600);

        const buildTime = [hours, minutes, seconds].map(UsefulInfo.normalizeNumber).join(':');

        return `Session time: ${buildTime}`;
    }

    static getFPSColor(fps: number): string {
        return fps >= 60 ? "00FF00" : fps >= 30 ? "FFFF00" : "FF0000";
    }

    static getPingColor(fps: number): string {
        return fps >= 200 ? "FF0000" : fps >= 100 ? "FFFF00" : "00FF00";
    }

    static update() {
        if (this.secondsSinceLastUpdate < Math.round(new Date().getTime() / 1000)) {
            const messageCollector = new DebugHudMessageCollector();

            /// #if DEBUG
            if (LogicVersion.isDeveloperBuild() && !UsefulInfo.disableDevBuildMessage)
                messageCollector.addMessage(`Gene Brawl DEV build [script: ${LogicVersion.getScriptVersion()}]`);
            /// #endif

            const fps = UsefulInfo.getFPS();
            const fpsColor = UsefulInfo.getFPSColor(fps);

            const ping = UsefulInfo.battlePing;
            const pingColor = UsefulInfo.getPingColor(ping);

            if (Configuration.showFPS) messageCollector.addMessage(`<c${fpsColor}>FPS: ${fps}</c>`);
            if (Configuration.showBattlePing && UsefulInfo.battlePing != -1) messageCollector.addMessage(`<c${pingColor}>Ping: ${ping}</c>`);
            if (Configuration.showCurrentTime) messageCollector.addMessage(UsefulInfo.getCurrentTime());
            if (Configuration.showSessionTime) messageCollector.addMessage(UsefulInfo.getSessionTime());
            if (Configuration.showTicks && this.ticks !== 0) messageCollector.addMessage("Ticks: " + this.ticks + ` (${Math.ceil(this.ticks / 20)} sec.)`);

            if (MessageManager.ownPlayerTeam != -1 && Configuration.showTeam)
                messageCollector.addMessage(`${LocalizationManager.getString("OWN_PLAYER_TEAM").format(
                    LocalizationManager.getString(MessageManager.ownPlayerTeam == 1 ? "RED" :
                        "BLUE"))}`);

            if (Configuration.showBattleInfo && UsefulInfo.battleInfo.length != 0)
                messageCollector.addMessage(UsefulInfo.battleInfo);

            const debugHud = Debug.getDebugHud();

            debugHud.setMessageCollector(messageCollector);

            this.frameCounter = 0;
            this.secondsSinceLastUpdate = Math.round(new Date().getTime() / 1000);
            return;
        }

        this.frameCounter += 1;
    }

    static setBattleInfo(info: string) {
        UsefulInfo.battleInfo = info;
    }

    static setBattlePing(battlePing: number) {
        UsefulInfo.battlePing = battlePing;
    }

    static canBeUpdated() {
        return Configuration.showFPS ||
            Configuration.showCurrentTime ||
            Configuration.showSessionTime ||
            Configuration.showBattleInfo ||
            Configuration.showBattlePing ||
            Configuration.showTeam;
    }
}
