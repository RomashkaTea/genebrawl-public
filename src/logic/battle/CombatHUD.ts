import {Libg} from "../../libs/Libg";
import {Configuration} from "../../gene/Configuration";
import {LogicVersion} from "../LogicVersion";
import {UsefulInfo} from "../../gene/features/UsefulInfo";
import {ClientInputManager} from "./ClientInputManager";
import {BattleMode} from "./BattleMode";
import {MovieClip} from "../../titan/flash/MovieClip";
import {StringTable} from "../data/StringTable";
import {DisplayObject} from "../../titan/flash/DisplayObject";
import {Constants} from "../../gene/Constants";
import {LogicBattleModeClient} from "./LogicBattleModeClient";
import {Debug} from "../../gene/Debug";

const CombatHUD_prepareNewIntro = new NativeFunction( // "three_versus_boss"
    Libg.offset(0x47EC94, 0x76D6C), 'void', ['pointer']
);

const CombatHUD_update = new NativeFunction( // "input lat"
    Libg.offset(0x49A2C8, 0x8D398), 'void', ['pointer', 'float']
);

const CombatHUD_setupPlayerCard = new NativeFunction( // "frame_front_levels_ph" | "Must have pointer to player card to setup" end of that func (v121 = sub_10006FFFC(v13, a2, a3, a4, a5, a8, a6, a7);)
    Libg.offset(0x482E20, 0x7A5E8), 'void', ['pointer', 'pointer', 'pointer', 'pointer', 'int', 'pointer', 'pointer', 'int', 'int']
);

// const CombatHUD_CombatHUD = new NativeFunction( // "laser_screen_mask"
//     Libg.offset(0x0, 0x0), 'void', ['pointer']
// )

export const CombatHUD_shouldHaveSpectateFollowButton = new NativeFunction( // CombatHUD::CombatHUD NOTSURE
    Libg.offset(0x4957CC, 0x89704), 'bool', []
);


// not sure about it
const CombatHUD_mirrorPlayfieldOffset = Libg.offset(0x0, 0xEE6188); // upper than "train_lamp_glow_right" if ( byte_10116... == v55)
const CombatHUD_movieClip = 96;
const CombatHUD_battleIntroOffset = 720;
const BattleIntro_movieClipOffset = 328;

const CombatHUD_connectionIndicatorOffset = 800; // v61.249
const CombatHUD_txtDebugOffset = 1136; // v62.258

export class CombatHUD {
    static patch() {
        Interceptor.replace(CombatHUD_update, new NativeCallback(function (combatHud, time) {
            CombatHUD_update(combatHud, time);

            const battleDebug = Debug.getBattleDebug();
            if (battleDebug)
                battleDebug.update(time);

            if (!CombatHUD_shouldHaveSpectateFollowButton()) {
                for (const combatHudOffset of Constants.COMBATHUD_ALPHA_OFFSETS) {
                    const hudObject = combatHud.add(combatHudOffset).readPointer();
                    if (hudObject.isNull())
                        continue;

                    CombatHUD.setAlphaOnHudObject(hudObject, Configuration.opacity / 100)
                }
            }

            const connectionIndicatorClip = combatHud.add(CombatHUD_connectionIndicatorOffset).readPointer();
            if (connectionIndicatorClip) {
                connectionIndicatorClip.add(Process.pointerSize).writeU8(1);
            }

            const txtDebugClip = combatHud.add(CombatHUD_txtDebugOffset).readPointer();
            if (txtDebugClip && LogicVersion.isDeveloperBuild()) {
                txtDebugClip.add(Process.pointerSize).writeU8(1);
            }

            UsefulInfo.setBattlePing(ClientInputManager.getPing(BattleMode.getClientInputManager()));

            const intro = combatHud.add(CombatHUD_battleIntroOffset).readPointer();
            if (intro.isNull())
                return;

            const movieClip = intro.add(BattleIntro_movieClipOffset).readPointer();
            if (movieClip.isNull())
                return;

            movieClip.add(Process.pointerSize).writeU8(Configuration.hideHeroesIntro ? 0 : 1);
        }, 'void', ['pointer', 'float']));

        Interceptor.replace(CombatHUD_setupPlayerCard, new NativeCallback(function (a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            if (Configuration.hideLeagueBattleCard)
                a5 = 0;

            CombatHUD_setupPlayerCard(a1, a2, a3, a4, a5, a6, a7, a8, a9);
        }, 'void', ['pointer', 'pointer', 'pointer', 'pointer', 'int', 'pointer', 'pointer', 'int', 'int']));

        Interceptor.replace(CombatHUD_prepareNewIntro, new NativeCallback(function (combatHUD) {
            CombatHUD_prepareNewIntro(combatHUD);

            const logicBattleModeClient = BattleMode.getLogic();

            if (LogicBattleModeClient.isUnderdog(logicBattleModeClient)) {
                const underdog: MovieClip = new MovieClip(combatHUD.add(CombatHUD_movieClip).readPointer()).getChildByName("underdog");
                if (underdog && !underdog.instance.isNull()) {
                    underdog.visibility = true;
                    underdog.getTextFieldByName("label_txt")!.setText(StringTable.getString("TID_UNDERDOG"));
                }
            }
        }, 'void', ['pointer']));
    }

    static setAlphaOnHudObject(object: NativePointer, alpha: number) {
        if (object.isNull()) {
            console.error("CombatHUD::setAlphaOnHudObject", "object is NULL");
            return;
        }

        console.log("CombatHUD::setAlphaOnHudObject", "alpha ", alpha);
        DisplayObject.setAlpha(object, alpha)
    }

    static mirrorPlayfield() {
        return CombatHUD_mirrorPlayfieldOffset.readU8();
    }
}
