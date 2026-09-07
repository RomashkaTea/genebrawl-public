import {Configuration} from "../../Configuration";
import {GradientNickname} from "../../features/GradientNickname";
import {MainCommand} from "../MainCommand";
import {Permissions} from "../Permissions";

export class ChangeNameCommand extends MainCommand {
    getCommandRegexp() {
        return /name/i;
    }

    execute(args: Array<string | number>) {
        let hashtag = args[0];
        let name = args[1];

        if (!hashtag || !name) {
            return "NAME_CMD_WRONG_INPUT";
        }

        if ((typeof hashtag == "number")
            || (typeof name == "number")) {

            return "NAME_CMD_WRONG_INPUT";
        }

        hashtag = hashtag.toUpperCase()
            .replace("#", "")
            .replace("O", "0");

        if (GradientNickname.doesPlayerHaveGradient(hashtag)) {
            return "NAME_CMD_INVALID_TAG";
        }

        console.log(`Changing name to ${name} for ${hashtag}`);

        Configuration.accountNames[hashtag] = name;
        Configuration.save();

        return "";
    }

    getPermission() {
        return Permissions.EVERYONE;
    }

    getCommandInformation() {
        return {
            name: "name",
            desc: "locally change someone's name",
            isHidden: false
        };
    }
}
