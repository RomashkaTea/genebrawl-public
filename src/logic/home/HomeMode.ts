import {Configuration} from "../../gene/Configuration";
import {GameStateManager} from "../../laser/client/state/GameStateManager";
import {Libg} from "../../libs/Libg";
import {LogicCommand} from "../command/LogicCommand";
import {LogicCommandManager} from "../command/LogicCommandManager";
import {logicConfDataOffset, logicDailyDataOffset} from "./LogicClientHome";

const logicHomeModeOffset = 72;
const homeScreenOffset = 40;

const LogicHomeMode_logicClientHomeOffset = 32;

const HomeMode_addCommand = new NativeFunction( // executeCommand: pCommand == nullptr
    Libg.offset(0x80A40C, 0x37021C), 'int', ['pointer', 'pointer']
);

const bypassOutOfSyncCommands = [
    506, 520, 525, 529, 568, 570, 578
];

export class HomeMode {
    static bypassOutOfSync(command: LogicCommand): boolean {
        return Configuration.antiOutOfSync && bypassOutOfSyncCommands.includes(command.getCommandType()); // do not send
    }

    static patch() {
        const self = this;

        Interceptor.replace(HomeMode_addCommand, new NativeCallback(function (homeMode, command) {
            let logicCommand = LogicCommandManager.createCommand(command);
            if (self.bypassOutOfSync(logicCommand)) {
                console.log("HomeMode:addCommand:", `bypass out of sync! (cmd=${logicCommand.getCommandType()})`);

                logicCommand.execute(HomeMode.getLogic());

                return 0;
            }

            return HomeMode_addCommand(homeMode, command);
        }, 'int', ['pointer', 'pointer']));
    }

    static addCommand(command: LogicCommand | NativePointer) {
        return HomeMode_addCommand(this.getInstance(), command instanceof LogicCommand ? command.instance : command);
    }

    static getInstance(): NativePointer {
        if (GameStateManager.isState(4)) {
            return GameStateManager.getCurrentState();
        }

        return NULL;
    }

    static getPlayerData(): NativePointer {
        return this.getLogicClientHome().add(logicDailyDataOffset).readPointer();
    }

    static getLogic(): NativePointer {
        return this.getInstance().add(logicHomeModeOffset).readPointer();
    }

    static getLogicClientHome(): NativePointer {
        return this.getLogic().add(LogicHomeMode_logicClientHomeOffset);
    }

    static getHomeScreen(): NativePointer {
        return this.getInstance().add(homeScreenOffset).readPointer();
    }

    static getConfData(): NativePointer {
        return this.getLogicClientHome().add(logicConfDataOffset).readPointer();
    }
}
