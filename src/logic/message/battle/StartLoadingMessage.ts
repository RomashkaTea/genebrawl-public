import {PiranhaMessage} from "../PiranhaMessage";
import {LogicPlayer} from "../../battle/LogicPlayer";

const playersCountOffset = 144;
const playersOffset = 224;

const ownPlayerIndexOffset = playersCountOffset + 4;
const ownPlayerTeamOffset = ownPlayerIndexOffset + 4;

const spectatePlayerIndexOffset = 176;

export class StartLoadingMessage extends PiranhaMessage {
    constructor(instance: NativePointer) {
        super(instance);
    }

    getPlayersCount() {
        return this.instance.add(playersCountOffset).readInt();
    }

    getOwnPlayerIndex() {
        return this.instance.add(ownPlayerIndexOffset).readInt();
    }

    getOwnPlayerTeam() {
        return this.instance.add(ownPlayerTeamOffset).readInt();
    }

    getPlayer(index: number): LogicPlayer {
        return new LogicPlayer(
            this.getPlayers().readPointer().add(Process.pointerSize * index).readPointer()
        );
    }

    getPlayers() {
        return this.instance.add(playersOffset).readPointer();
    }

    getPlayersArray(): LogicPlayer[] {
        const array = this.getPlayers();
        const arr: LogicPlayer[] = [];

        for (let i = 0; i < this.getPlayersCount(); i++) {
            arr.push(new LogicPlayer(
                array.readPointer().add(Process.pointerSize * i).readPointer()
            ));
        }

        return arr;
    }

    getSpectatePlayerIndex(): number {
        return this.instance.add(spectatePlayerIndexOffset).readInt();
    }
}
