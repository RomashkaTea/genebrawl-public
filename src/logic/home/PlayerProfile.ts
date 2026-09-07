import {GradientNickname} from "../../gene/features/GradientNickname";
import {Libg} from "../../libs/Libg";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";
import {GlobalID} from "../data/GlobalID";
import {LogicDataTables} from "../data/LogicDataTables";
import {LogicPlayerTitleData} from "../data/LogicPlayerTitleData";
import {LogicData} from "../data/LogicData";

const PlayerProfile_decode = new NativeFunction(
    Libg.offset(0x9A5018, 0x49FD40), 'void', ['pointer', 'pointer'] // 24113
);

const PlayerProfile_PlayerDisplayDataOffset = 48;
const titleDataOffset = 120;

const heroesOffset = 24;

const statsOffset = 32;
const statsCountOffset = 44;

export class PlayerProfile {
    instance: NativePointer;

    constructor(instance: NativePointer) {
        this.instance = instance;
    }

    getStat(stat: number): number {
        for (let j = 0; j < this.instance.add(statsCountOffset).readInt(); j++) {
            const vector = this.instance.add(statsOffset).readPointer().add(Process.pointerSize * j).readPointer();

            if (vector.readInt() == stat)
                return vector.add(4).readInt();
        }

        return 0;
    }

    getHero(globalId: number): NativePointer {
        const heroes = this.instance.add(heroesOffset).readPointer();

        for (let j = 0; j < heroes.add(12).readInt(); j++) {
            const heroEntry = heroes.readPointer().add(Process.pointerSize * j).readPointer();

            if (LogicData.getGlobalID(heroEntry.readPointer()) == globalId)
                return heroEntry;
        }

        return NULL;
    }

    getPlayerName(): string {
        return this.instance.add(48).readPointer().fromsc();
    }

    getPlayerId(): number[] {
        return this.instance.accountId();
    }

    static patch() {
        Interceptor.replace(PlayerProfile_decode, new NativeCallback(function (playerProfile, stream) {
            PlayerProfile.decode(playerProfile, stream);

            const playerTag = HashTagCodeGenerator.toCode(playerProfile);

            const playerDisplayData = playerProfile.add(PlayerProfile_PlayerDisplayDataOffset).readPointer();

            let dataRef = new LogicPlayerTitleData(playerProfile.add(titleDataOffset).readPointer());

            if (GradientNickname.doesPlayerHaveTitle(playerTag)) {
                dataRef = new LogicPlayerTitleData(LogicDataTables.getByGlobalId(GlobalID.createGlobalID(76, 83)));

                playerProfile.add(titleDataOffset).writePointer(dataRef.instance);

                const instanceId = 1000 + GradientNickname.getPlayerTitleIndex(playerTag)

                dataRef.setGlobalID(GlobalID.createGlobalID(76, instanceId));
            } else {
                if (!dataRef.instance.isNull()) {
                    const instanceId = dataRef.getInstanceId();

                    if (instanceId >= 1000) {
                        dataRef.setGlobalID(GlobalID.createGlobalID(76, 83));
                    }
                }
            }

            GradientNickname.setPlayerGradient(playerTag, playerDisplayData);
        }, 'void', ['pointer', 'pointer']))
    }

    static decode(self: NativePointer, stream: NativePointer) {
        PlayerProfile_decode(self, stream);
    }
}
