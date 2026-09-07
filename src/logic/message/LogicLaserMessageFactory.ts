import {Libg} from "../../libs/Libg";
import {LoginFailedMessage} from "./account/LoginFailedMessage";
import {LoginOkMessage} from "./account/LoginOkMessage";
import {OwnHomeDataMessage} from "./home/OwnHomeDataMessage";
import {PiranhaMessage} from "./PiranhaMessage";
import {BattleEndMessage} from "./battle/BattleEndMessage";
import {StartLoadingMessage} from "./battle/StartLoadingMessage";
import {Libc} from "../../libs/Libc";

const LogicLaserMessageFactory_createMessageByType = new NativeFunction( // just search immediate value (messageType) like 26085 (output: MOV W8, #0x5F0D; jumptable 0000000100398FB0 default case)
    Libg.offset(0x68F6C4, 0x46FCCC), 'pointer', ['pointer', 'int'] // or xref from message ctor...
);

export class LogicLaserMessageFactory {
    private static instance: NativePointer = Libc.malloc(16);

    static patch() {
        this.instance.add(Process.pointerSize).writeInt(0);
    }

    static createMessage(messageType: number): NativePointer {
        return LogicLaserMessageFactory_createMessageByType(this.instance, messageType);
    }

    static createMessageByType(instance: NativePointer): PiranhaMessage {
        const messageType = PiranhaMessage.getMessageType(instance);

        switch (messageType) {
            case 20103:
                return new LoginFailedMessage(instance);
            case 20104:
                return new LoginOkMessage(instance);
            case 20559:
                return new StartLoadingMessage(instance);
            case 23456:
                return new BattleEndMessage(instance);
            case 24101:
                return new OwnHomeDataMessage(instance);
            default:
                return new PiranhaMessage(instance);
        }
    }
}
