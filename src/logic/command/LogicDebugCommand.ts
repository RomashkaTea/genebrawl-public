import {Libc} from "../../libs/Libc";
import {Libg} from "../../libs/Libg";
import {LogicCommand} from "./LogicCommand";

const LogicDebugCommand_LogicDebugCommand = new NativeFunction( // "LogicDebugCommand::loadFromJSON actionIdx not found!"
    Libg.offset(0x84FEA8, 0x3A4A18), 'void', ['pointer']
);

const allocSize = 120;
const actionIdxOffset = 28;
const intParameterOffset = 32;

export class LogicDebugCommand extends LogicCommand {
    constructor(actionIdx: number, intParameter: number) {
        let instance = Libc.malloc(allocSize);
        LogicDebugCommand_LogicDebugCommand(instance);

        super(instance);

        instance.add(actionIdxOffset).writeInt(actionIdx);
        instance.add(intParameterOffset).writeInt(intParameter);
    }
}
