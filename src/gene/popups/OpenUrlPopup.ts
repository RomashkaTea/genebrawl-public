import {Libc} from "../../libs/Libc";
import {TextField} from "../../titan/flash/TextField";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {GenericPopup} from "../../titan/flash/gui/GenericPopup";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {GameInputField} from "../../titan/flash/input/GameInputField";
import {Storage} from "../Storage";
import {LocalizationManager} from "../../gene/localization/index";
import {GUI} from "../../titan/flash/gui/GUI";
import {SimpleWebview} from "../../titan/client/SimpleWebview";

export class OpenUrlPopup extends GenericPopup {
    gameInputField!: GameInputField;
    button: GameButton;
    textInputButton!: GameButton;
    textField!: TextField;

    constructor() {
        super("club_mail_popup");

        this.setTitle(LocalizationManager.getString("OPEN_URL"));

        this.button = this.addButtonWithText("join_button", 1, LocalizationManager.getString("OPEN_URL_BUTTON"));

        this.createInputField();

        this.closeButton!.setButtonListener(new IButtonListener(this.buttonClicked));
        this.button.setButtonListener(new IButtonListener(this.buttonClicked));

        const previousPopup = Storage.getPopup(this) ? Storage.getPopup(this) as OpenUrlPopup : null;

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

        this.textField = movieClip.getTextFieldByName("teamcode_txt") as TextField;

        this.textField.setText("google.com");

        this.gameInputField = new GameInputField(Libc.malloc(200), this.textField, this.instance);

        this.gameInputField.setScaleTextIfNeed(true);
        this.gameInputField.setMaxTextLength(255);

        this.textInputButton.setButtonListener(new IButtonListener(this.textInputClicked));

        this.setActiveInputField(this.gameInputField);
    }

    update(float: number) {
        super.update(float);
    }

    private textInputClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof OpenUrlPopup) as OpenUrlPopup;

        popup.gameInputField.activate(true);
    }

    private buttonClicked(listener: NativePointer, button: NativePointer) {
        const popup = Storage.popups.find(e => e instanceof OpenUrlPopup) as OpenUrlPopup;

        const gameInputField = popup.gameInputField;

        if (popup.button.instance.equals(button)) {
            const gameInputField = popup.gameInputField;
            const input = gameInputField.getInputText().trim();

            gameInputField.activate(false);

            if (input.trim() == "") {
                GUI.showFloaterText(LocalizationManager.getString("INCORRECT_URL"));
                return;
            }

            let builtInput = input;

            if (input.startsWith("http://")) {
                builtInput = builtInput.replace("http://", "https://");
            }

            if (!input.startsWith("http")) {
                builtInput = "https://" + builtInput;
            }

            const simpleWebView = new SimpleWebview();
            simpleWebView.setTitle("Gene Brawl Webview"); // FIXME: error
            simpleWebView.loadUrl(builtInput);
            GUI.showPopup(simpleWebView.instance, 0, 0, 1);

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
