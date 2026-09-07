import {GradientNickname} from "../../gene/features/GradientNickname";
import {Libg} from "../../libs/Libg";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";
import {LogicHeroConfiguration} from "./LogicHeroConfiguration";
import {LogicPlayerTitleData} from "../data/LogicPlayerTitleData";
import {LogicDataTables} from "../data/LogicDataTables";
import {GlobalID} from "../data/GlobalID";

const LogicPlayer_decode = new NativeFunction( // 20559 decode
    Libg.offset(0x9EAB50, 0x4CA608), 'void', ['pointer', 'pointer']
);

const battleCard_titleOffset = 40;
const battleCard = 440;

const playerIndexOffset = 8;
const teamIndexOffset = 12;
const characterGlobalIdOffset = 16;
const heroesOffset = 48;
const heroesCountOffset = 60;

export class LogicPlayer {
    instance: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
    }

    getName(): string {
        return this.getPlayerDisplayData().fromsc();
    }

    getTeamIndex(): number {
        return this.instance.add(teamIndexOffset).readInt();
    }

    getHero(index: number) {
        return this.getHeroes().add(Process.pointerSize * index).readPointer();
    }

    getHeroes() {
        return LogicPlayer.getHeroes(this.instance);
    }

    getHeroesCount() {
        return LogicPlayer.getHeroesCount(this.instance);
    }

    getHashTag() {
        return LogicPlayer.getHashTag(this.instance);
    }

    getPlayerDisplayData() {
        return LogicPlayer.getPlayerDisplayData(this.instance);
    }

    getPlayerIndex(): number {
        return LogicPlayer.getPlayerIndex(this.instance);
    }

    toString(): string {
        let result = `• ${this.getName()} (#${this.getHashTag()}) `;
        let heroesCount = this.getHeroesCount();
        if (heroesCount > 1) {
            result += "\n    ";
        }

        for (let index = 0; index < this.getHeroesCount(); index++) {
            if (index > 0) {
                result += "\n    ";
            }
            const hero = this.getHero(index);
            result += LogicHeroConfiguration.toString(hero);
        }

        return result;
    }

    static patch() {
        const self = this;

        Interceptor.replace(LogicPlayer_decode, new NativeCallback(function (logicPlayer, byteStream) {
            LogicPlayer.decode(logicPlayer, byteStream);

            const playerTag = HashTagCodeGenerator.toCode(logicPlayer);
            if (logicPlayer.add(battleCard).readPointer().isNull())
                return;

            const playerDisplayData = self.getPlayerDisplayData(logicPlayer);

            if (GradientNickname.doesPlayerHaveTitle(playerTag)) {
                let dataRef = new LogicPlayerTitleData(LogicDataTables.getByGlobalId(GlobalID.createGlobalID(76, 83)));

                self.setTitle(logicPlayer, dataRef.instance);

                const instanceId = 1000 + GradientNickname.getPlayerTitleIndex(playerTag);
                dataRef.setGlobalID(GlobalID.createGlobalID(76, instanceId));
            }

            GradientNickname.setPlayerGradient(playerTag, playerDisplayData);
        }, 'void', ['pointer', 'pointer']));
    }

    static decode(logicPlayer: NativePointer, ByteStream: NativePointer) {
        LogicPlayer_decode(logicPlayer, ByteStream);
    }

    static getName(logicPlayer: NativePointer): string {
        return LogicPlayer.getPlayerDisplayData(logicPlayer).fromsc();
    }

    static isBot(logicPlayer: NativePointer) {
        return this.getName(logicPlayer).length == 1;
    }

    static getCharacterGlobalId(logicPlayer: NativePointer): number {
        return logicPlayer.add(characterGlobalIdOffset).readInt();
    }

    static getHashTag(logicPlayer: NativePointer) {
        return LogicPlayer.isBot(logicPlayer) ? "0" : HashTagCodeGenerator.toCode(logicPlayer);
    }

    static getHeroes(logicPlayer: NativePointer) {
        return logicPlayer.add(heroesOffset).readPointer();
    }

    static getHeroesCount(logicPlayer: NativePointer) {
        return logicPlayer.add(heroesCountOffset).readInt();
    }

    static getPlayerDisplayData(logicPlayer: NativePointer): NativePointer {
        return logicPlayer.add(battleCard).readPointer().readPointer();
    }

    static setTitle(logicPlayer: NativePointer, title: NativePointer) {
        logicPlayer.add(battleCard).readPointer().add(battleCard_titleOffset).writePointer(title);
    }

    static toString(logicPlayer: NativePointer): string {
        let result: string = `• ${this.getName(logicPlayer)} (#${HashTagCodeGenerator.toCode(logicPlayer)}) `;

        const heroes = this.getHeroes(logicPlayer);

        for (let j = 0; j < logicPlayer.add(heroesCountOffset).readInt(); j++) {
            const hero = heroes.add(Process.pointerSize * j).readPointer();
            result += LogicHeroConfiguration.toString(hero);
        }

        return result;
    }

    static getPlayerIndex(playerPtr: NativePointer) {
        return playerPtr.add(playerIndexOffset).readInt();
    }
}
