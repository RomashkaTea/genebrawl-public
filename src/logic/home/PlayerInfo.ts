import {RGBA} from "../../gene/features/RGBA";
import {LocalizationManager} from "../../gene/localization/index";
import {GameStateManager} from "../../laser/client/state/GameStateManager";
import {Libc} from "../../libs/Libc";
import {Libg} from "../../libs/Libg";
import {DropGUIContainer} from "../../titan/flash/gui/DropGUIContainer";
import {GUI} from "../../titan/flash/gui/GUI";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {LogicLong} from "../../titan/logic/LogicLong";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";
import {Application} from "../../titan/utils/Application";

const PlayerInfo_PlayerInfo = new NativeFunction(
    Libg.offset(0x4F306C, 0xD4C80), 'pointer', ['pointer', 'pointer', 'int', 'pointer', 'int'] // "other_players_profile"
);

const PlayerInfo_refreshPlayerHeader = new NativeFunction( // "tag_txt"
    Libg.offset(0x4F754C, 0xD8B7C), 'void', ['pointer']
);

const guiContainerOffset = 192;
const logicLongOffset = 440;

export class PlayerInfo {
    static copyTagButton: GameButton;
    static instance: NativePointer;

    static createPlayerProfile(logicLong: LogicLong) {
        const instance = Libc.malloc(560);
        PlayerInfo_PlayerInfo(instance, logicLong.instance, 2, NULL, 0);
        return instance;
    }

    static patch() {
        Interceptor.replace(PlayerInfo_refreshPlayerHeader, new NativeCallback((playerInfo) => {
            PlayerInfo_refreshPlayerHeader(playerInfo);

            const guiContainer = new DropGUIContainer(playerInfo.add(guiContainerOffset).readPointer());
            PlayerInfo.copyTagButton = guiContainer.addGameButton("tag_txt", true);
            PlayerInfo.copyTagButton.setButtonListener(new IButtonListener(PlayerInfo.buttonPressed));

            PlayerInfo.instance = playerInfo;
        }, 'void', ['pointer']));

        Interceptor.replace(PlayerInfo_PlayerInfo, new NativeCallback(function (playerInfo, logicLong, a1, a2, a3) {
            if (GameStateManager.isHomeMode()) {
                return PlayerInfo_PlayerInfo(playerInfo, logicLong, a1, a2, a3);
            }

            GUI.showFloaterText(LocalizationManager.getString("CANNOT_SEE_PROFILE_IN_BATTLE"));
            return NULL;
        }, 'pointer', ['pointer', 'pointer', 'int', 'pointer', 'int']));
    }

    static buttonPressed() {
        const logicLong = PlayerInfo.instance
            .add(logicLongOffset).readPointer();

        const hashTag = HashTagCodeGenerator.toCode(logicLong);

        Application.copyString("#" + hashTag);

        GUI.showFloaterText(
            LocalizationManager.getString("TAG_COPIED"),
            RGBA.green
        );
    }
}
