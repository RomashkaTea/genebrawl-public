import {LogicLaserMessageFactory} from "../LogicLaserMessageFactory";
import {PiranhaMessage} from "../PiranhaMessage";

const unk1Offset = 144;
const unk2Offset = 148;
const regionIdOffset = 152;

export class TriggerStartLatencyTestMessage extends PiranhaMessage {
    constructor(regionId: number) {
        const instance = LogicLaserMessageFactory.createMessage(39003);

        instance.add(unk1Offset).writeInt(1);
        instance.add(unk2Offset).writeInt(1);
        instance.add(regionIdOffset).writeInt(regionId);

        super(instance);
    }
}
