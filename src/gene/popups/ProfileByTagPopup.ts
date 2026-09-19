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
import {LogicLong} from "../../titan/logic/LogicLong";
import {PlayerInfo} from "../../logic/home/PlayerInfo";
import {AllianceManager} from "../../logic/alliance/AllianceManager";

export class ProfileByTagPopup extends GenericPopup {
    gameInputField!: GameInputField;
    button: GameButton;
    textInputButton!: GameButton;
    textField!: TextField;

    constructor() {
        super("gameroom_joincode_popup");

        this.setTitle(LocalizationManager.getString("PROFILE_TAG"));

        this.button = this.addButtonWithText("join_button", 1, LocalizationManager.getString("PROFILE"));

        this.createInputField();

        this.closeButton!.setButtonListener(new IButtonListener(this.buttonClicked));
        this.button.setButtonListener(new IButtonListener(this.buttonClicked));

        const previousPopup = Storage.getPopup(this) ? Storage.getPopup(this) as ProfileByTagPopup : null;

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
        const popup = Storage.popups.find(e => e instanceof ProfileByTagPopup) as ProfileByTagPopup;

        popup.gameInputField.activate(true);
    }

    private buttonClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof ProfileByTagPopup) as ProfileByTagPopup;
        if (popup.button.instance.equals(button)) {
            const gameInputField = popup.gameInputField;
            const input = gameInputField.getInputText().trim().toUpperCase();

            gameInputField.activate(false);

            if (input.length < 1) {
                GUI.showFloaterText(LocalizationManager.getString("PROFILE_TAG_NO_CODE"));
                return;
            }

            if (!input.startsWith('#') || input.length < 4 || input.length > 15) {
                GUI.showFloaterText(LocalizationManager.getString("PROFILE_TAG_WRONG_CODE"));
                return;
            }

            const id = HashTagCodeGenerator.toId(input);

            if (id[1] == 0) {
                GUI.showFloaterText(LocalizationManager.getString("PROFILE_TAG_WRONG_CODE"));
                return;
            }

            const logicLong = new LogicLong(id[0], id[1]);

            const profile = PlayerInfo.createPlayerProfile(logicLong);

            AllianceManager.showPopup(profile);

            console.log("Closed!");
            popup.gameInputField.activate(false);
            popup.fadeOut();
            Storage.removePopupByInstance(popup.instance);
        }
        else if (popup.closeButton!.instance.equals(button)) {
            console.log("Closed!");
            popup.gameInputField.activate(false);
            popup.fadeOut();
            Storage.removePopupByInstance(popup.instance);
        }
    }
}
