import {Libg} from "../../libs/Libg";
import {SCString} from "../../titan/utils/SCString";
import {CommandsHandler} from "../chatcommands/CommandsHandler";
import {Configuration} from "../Configuration";
import {Constants} from "../Constants";
import {LocalizationManager} from "../localization/index";
import {TeamChatMessage_encode} from "./TeamSpam";

const ChatToAllianceStreamMessage_encode = new NativeFunction( // 14315 below ctor
    Libg.offset(0x0, 0x4819F0), 'void', ['pointer']
);

const messageOffset = 144;

export class ChatCommandHandler {
    private static handleMessage(message: NativePointer) {
        if (message.isNull())
            return false;

        let textMessage = message.fromsc();

        if (textMessage.startsWith("/")) {
            const command = textMessage.split(" ")[0].replace("/", "");
            const args = textMessage.split(" ").slice(1).map((arg: any) => isNaN(arg) ? arg : Number(arg));

            let executionResult = CommandsHandler.execute(command, args);

            switch (executionResult) {
                case "NO_COMMAND_DEFINED":
                    executionResult = LocalizationManager.getString("NO_COMMAND_DEFINED");
                    break;
                case "":
                    executionResult = "OK!";
                    break;
                default:
                    executionResult = executionResult.split(" ").length === 1 ?
                        LocalizationManager.getString(executionResult) :
                        executionResult;
                    break;
            }

            message.scptr(executionResult);
            return true;
        }

        return true;
    }

    static patch(): void {
        CommandsHandler.load();

        Interceptor.replace(TeamChatMessage_encode, new NativeCallback(function (message) {
            const shouldSendMessage = ChatCommandHandler.handleMessage(message.add(messageOffset));
            ChatCommandHandler.antiCensorshipBypass(message.add(messageOffset));

            if (shouldSendMessage) TeamChatMessage_encode(message);
        }, 'void', ['pointer']));

        Interceptor.replace(ChatToAllianceStreamMessage_encode, new NativeCallback(function (message) {
            const shouldSendMessage = ChatCommandHandler.handleMessage(message.add(messageOffset).readPointer());
            ChatCommandHandler.antiCensorshipBypass(message.add(messageOffset).readPointer());

            if (shouldSendMessage) ChatToAllianceStreamMessage_encode(message);
        }, 'void', ['pointer']));
    }

    private static antiCensorshipBypass(message: NativePointer): void {
        if (!Configuration.antiProfanity) return; // FIXME: remove check when fixed

        let messageText: string = message.fromsc();

        const result = messageText.split("").join(Constants.ANTIPROFANITY_BYTES) + "\x00";

        SCString.setContent(message, result);
    }

    private static addCombiningCharacters(text: string): string {
        const combiningChar = '\uFE00';
        return text.split('').map(char => char + combiningChar).join('');
    }
}
