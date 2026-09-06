import {LogicDebugCommand} from "../../logic/command/LogicDebugCommand";
import {HomeMode} from "../../logic/home/HomeMode";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";

export class DebugCommandButton extends GameButton {
    private readonly debugActionIdx: number;
    private readonly debugIntParameter: number;
    readonly btnType: number;

    constructor(actionIdx: number, intParameter: number, btnType: number) {
        super();

        this.debugActionIdx = actionIdx;
        this.debugIntParameter = intParameter;
        this.btnType = btnType;

        this.instance.add(450).writeInt(this.debugActionIdx);
        this.instance.add(454).writeInt(this.debugIntParameter);

        this.setButtonListener(new IButtonListener(this.callback));
    }

    callback(listener: NativePointer, button: NativePointer) {
        let actionIdx = button.add(450).readInt();
        let intParameter = button.add(454).readInt();

        console.log("DebugCommandButton::callback: actionIdx " + actionIdx + ", intParameter: " + intParameter);

        let command = new LogicDebugCommand(actionIdx, intParameter);
        command.execute(HomeMode.getLogic());
    }
}
