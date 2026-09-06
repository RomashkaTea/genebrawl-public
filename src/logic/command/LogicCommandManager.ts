import {LogicCommand} from "./LogicCommand";

export class LogicCommandManager {
    static createCommand(command: NativePointer): LogicCommand {
        let commandType = LogicCommand.getCommandType(command);

        switch (commandType) {
            default: return new LogicCommand(command);
        }
    }
}
