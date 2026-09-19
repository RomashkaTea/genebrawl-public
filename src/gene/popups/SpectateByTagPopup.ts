import {Libc} from "../../libs/Libc";
import {TextField} from "../../titan/flash/TextField";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {GenericPopup} from "../../titan/flash/gui/GenericPopup";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {GameInputField} from "../../titan/flash/input/GameInputField";
import {Storage} from "../Storage";
import {LocalizationManager} from "../../gene/localization/index";
import {GUI} from "../../titan/flash/gui/GUI";
import {HashTagCodeGenerator} from "../../titan/logic/util/HashTagCodeGenerator";
import {StartSpectateMessage} from "../../logic/message/battle/StartSpectateMessage";
import {MessageManager} from "../../laser/client/network/MessageManager";

export class SpectateByTagPopup extends GenericPopup {
    gameInputField!: GameInputField;
    button: GameButton;
    textInputButton!: GameButton;
    textField!: TextField;

    constructor() {
        super("gameroom_joincode_popup");

        this.setTitle(LocalizationManager.getString("SPECTATE_TAG"));

        this.button = this.addButtonWithText("join_button", 1, LocalizationManager.getString("SPECTATE"));

        this.createInputField();

        this.closeButton!.setButtonListener(new IButtonListener(this.buttonClicked));
        this.button.setButtonListener(new IButtonListener(this.buttonClicked));

        const previousPopup = Storage.getPopup(this) ? Storage.getPopup(this) as SpectateByTagPopup : null;

        if (previousPopup) {
            try {
                previousPopup.gameInputField.activate(false);
                previousPopup.fadeOut();
                Storage.removePopupByInstance(previousPopup.instance);
            } catch (e) { }
        }

        Storage.addPopup(this);
    }

    createInputField() {
        this.textInputButton = this.addButtonWithText("team_code_input", 2, "");

        const movieClip = this.textInputButton.getMovieClip();

        this.textField = movieClip.getTextFieldByName("text") as TextField;

        this.gameInputField = new GameInputField(Libc.malloc(200), this.textField, this.instance);

        this.gameInputField.setScaleTextIfNeed(true);
        this.gameInputField.setMaxTextLength(15);

        this.textInputButton.setButtonListener(new IButtonListener(this.textInputClicked));

        this.setActiveInputField(this.gameInputField);
    }

    update(float: number) {
        super.update(float);
    }

    private textInputClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof SpectateByTagPopup) as SpectateByTagPopup;

        popup.gameInputField.activate(true);
    }

    private buttonClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof SpectateByTagPopup) as SpectateByTagPopup;

        if (popup.button.instance.equals(button)) {
            const gameInputField = popup.gameInputField;
            const input = gameInputField.getInputText().trim().toUpperCase();

            gameInputField.activate(false);

            if (input.length < 1) {
                GUI.showFloaterText(LocalizationManager.getString("SPECTATE_TAG_NO_CODE"));
                return;
            }

            if (!input.startsWith('#') || input.length < 4 || input.length > 15) {
                GUI.showFloaterText(LocalizationManager.getString("SPECTATE_TAG_WRONG_CODE"));
                return;
            }

            const id = HashTagCodeGenerator.toId(input);

            if (id[1] == 0) {
                GUI.showFloaterText(LocalizationManager.getString("SPECTATE_TAG_WRONG_CODE"));
                return;
            }

            const logicLong = Libc.malloc(8);
            logicLong.writeInt(id[0]);
            logicLong.add(4).writeInt(id[1]);

            MessageManager.sendMessage(new StartSpectateMessage(logicLong, false));
        }
        else if (popup.closeButton!.instance.toInt32() == button.toInt32()) {
            console.log("Closed!");
            popup.gameInputField.activate(false);
            popup.fadeOut();
            Storage.removePopupByInstance(popup.instance);
        }
    }
}
