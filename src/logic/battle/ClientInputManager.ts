import {Libg} from "../../libs/Libg";
import {ClientInput, ClientInputType} from "./ClientInput";
import {BattleMode} from "./BattleMode";
import {Configuration} from "../../gene/Configuration";

const ClientInputManager_addInput = new NativeFunction( // check by ClientInput ctor
    Libg.offset(0x6746D8, 0x21C2A0), 'void', ['pointer', 'pointer']
);

const pingOffset = 48;

export class ClientInputManager {
    static patch() {
        Interceptor.replace(ClientInputManager_addInput, new NativeCallback(function (manager, input) {
            const inputType = ClientInput.getInputType(input);

            if (!Configuration.showUlti && inputType == ClientInputType.UltiEnable) {
                return;
            }

            ClientInputManager_addInput(manager, input);
        }, 'void', ['pointer', 'pointer']));
    }

    static addInput(clientInput: ClientInput): void {
        ClientInputManager_addInput(
            BattleMode.getClientInputManager(),
            clientInput.instance
        );
    }

    static getPing(instance: NativePointer): number {
        return instance.add(pingOffset).readInt();
    }
}
