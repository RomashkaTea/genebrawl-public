import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {Debug} from "../Debug";

export class ToggleDebugClickerButton extends GameButton {
    constructor() {
        super();

        this.setButtonListener(new IButtonListener(this.callback));
    }

    callback() {
        console.log("ToggleDebugClickerButton::callback");
    }
}
