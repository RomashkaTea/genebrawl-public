import {Libg} from "../../libs/Libg";
import {Configuration} from "../../gene/Configuration";
import {ContextMenu} from "../../titan/flash/gui/ContextMenu";
import {LogicDefines} from "../../LogicDefines";

const BattleEndPopup_proceedToNextState = new NativeFunction( // "goToState(%d) - already in same state" (should be in the start of func)
    Libg.offset(0x544284, 0x10A578), 'void', ['pointer', 'int']
);

const BattleEndPopup_goHome = new NativeFunction( // "Trying exit from battle end state %d, but not allowed"
    Libg.offset(0x544284, 0x114F9C), 'void', ['pointer', 'bool']
);

const BattleEndPopup_kudosPatch1 = new NativeFunction( // is kudos given to any player
    Libg.offset(0x0, -1), 'int', ['pointer', 'int']
);

const BattleEndPopup_kudosPatch2 = new NativeFunction( // is player kudos'ed
    Libg.offset(0x0, -1), 'bool', ['pointer', 'int', 'int']
);

const BattleEndPopup_BattleEndPopup = Libg.offset(0x0, 0x107C68); // "battle_end_top_left" (not sure)

export class BattleEndPopup {
    static patch() {
        Interceptor.replace(BattleEndPopup_proceedToNextState, new NativeCallback(function (battleEndPopup, state) {
            if (state == 4 && Configuration.skipBattleEndReplay) {
                state = 1;
            }

            console.log("BE: " + state);

            if (Configuration.autoExitAfterBattle) {
                BattleEndPopup_proceedToNextState(battleEndPopup, 1);
                BattleEndPopup_proceedToNextState(battleEndPopup, 3);
                BattleEndPopup_goHome(battleEndPopup, 1);
            }
            else {
                BattleEndPopup_proceedToNextState(battleEndPopup, state);
            }
        }, 'void', ['pointer', 'int']));

        Interceptor.attach(BattleEndPopup_BattleEndPopup, {
            onLeave() {
                ContextMenu.shouldShowContextMenu = true;
            }
        });

        Interceptor.attach(BattleEndPopup_goHome, {
            onEnter() {
                if (LogicDefines.isPlatformAndroid()) {
                    Libg.offset(0xFC29C4, -1).writeU8(0);
                }
            }
        });
    }
}
