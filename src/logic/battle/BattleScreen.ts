import {Configuration} from "../../gene/Configuration";
import {Libg} from "../../libs/Libg";
import {ClientInputManager} from "./ClientInputManager";
import {ClientInput, ClientInputType} from "./ClientInput";
import {BattleMode} from "./BattleMode";
import {LogicBattleModeClient} from "./LogicBattleModeClient";
import {CombatHUD, CombatHUD_shouldHaveSpectateFollowButton} from "./CombatHUD";
import {LogicGameObjectClient} from "./objects/LogicGameObjectClient";
import {Sprite} from "../../titan/flash/Sprite";
import { Debug } from "../../gene/Debug";

const BattleScreen_instance = Libg.offset(0x103E2F8, 0xEE64D0); // "pressReplayControlZap"

const BattleScreen_enter = new NativeFunction( // "land_zone"
    Libg.offset(0x6C5F50, 0x25F024), 'void', ['pointer']
);

const BattleScreen_isAFK = new NativeFunction(
    Libg.offset(0x6D4C7C, 0x26C098), 'bool', ['pointer']
);

const BattleScreen_cameraFunc = new NativePointer(
    Libg.offset(0x0, 0x260198)
);

const afkWarningOffset = 2984;
const combatHudOffset = 2232;
const sideMaskSidesOffsets = [256, 264, 272, 280];
const cameraFieldsOffset = 2024;

export class BattleScreen {
    static autoAttackTick: number = 0;

    static getInstance(): NativePointer {
        return BattleScreen_instance.readPointer();
    }

    static getCombatHUD(battleScreen: NativePointer): NativePointer {
        return battleScreen.add(combatHudOffset).readPointer();
    }

    static patch(): void {
        const self = this;

        Interceptor.attach(BattleScreen_enter, {
            onEnter(args) {
                this.battleScreen = args[0];
            },
            onLeave(retval) {
                if (Configuration.skipReplayIntro && CombatHUD_shouldHaveSpectateFollowButton()) {
                    const clientInput = new ClientInput(ClientInputType.Movement);
                    clientInput.setXY(180, 0);
                    ClientInputManager.addInput(clientInput);
                }

                const combatHUD = self.getCombatHUD(this.battleScreen);

                if (combatHUD.isNull()) return;
                console.log("combat hud is not null!");
                Debug.getBattleDebug().drawButtons(combatHUD);

                if (!Configuration.showSidemask) {
                    for (const sideOffset of sideMaskSidesOffsets) {
                        const sidePtr = combatHUD.add(sideOffset).readPointer();
                        if (!sidePtr.isNull()) {
                            Sprite.removeChild(combatHUD, sidePtr);
                            combatHUD.add(sideOffset).writePointer(NULL);
                        }
                    }
                }
            }
        });

        Interceptor.attach(BattleScreen_cameraFunc, function () {
            const arm64Context = this.context as Arm64CpuContext;

            const battleScreen = BattleScreen.getInstance();

            const logicBattleModeClient = BattleMode.getLogic();

            const OwnCharacter = LogicBattleModeClient.getOwnCharacter(logicBattleModeClient);

            if (OwnCharacter.isNull())
                return;

            const posX = OwnCharacter.add(48).readU32();
            const posY = OwnCharacter.add(52).readU32();

            switch (Configuration.battleCammeraMode) {
                case 1:
                    battleScreen.add(cameraFieldsOffset).writeFloat(battleScreen.add(cameraFieldsOffset).readFloat() - battleScreen.add(cameraFieldsOffset).readFloat() - battleScreen.add(cameraFieldsOffset + 12).readFloat() + posX); //0
                    battleScreen.add(cameraFieldsOffset + 4).writeFloat(battleScreen.add(cameraFieldsOffset + 4).readFloat() - posY - battleScreen.add(cameraFieldsOffset + 16).readFloat()); //1
                    battleScreen.add(cameraFieldsOffset + 8).writeFloat(4000); //2
                    battleScreen.add(cameraFieldsOffset + 12).writeFloat(posX); //3
                    battleScreen.add(cameraFieldsOffset + 16).writeFloat(-posY); //4
                    battleScreen.add(cameraFieldsOffset + 20).writeFloat(300); //5
                    break;

                case 2:
                    const chair = 0.58779 * (CombatHUD.mirrorPlayfield() ? 1 : -1);

                    const tileMap = LogicBattleModeClient.getTileMap(logicBattleModeClient);
                    const mapWidth = tileMap.getMapWidth();
                    const mapHeight = tileMap.getMapHeight();

                    console.log(CombatHUD.mirrorPlayfield());

                    arm64Context.s2 = mapHeight * 0.5;
                    arm64Context.s3 = mapHeight * 7.5;

                    console.log(arm64Context.s2, arm64Context.s3);

                    battleScreen.add(cameraFieldsOffset).writeFloat(mapWidth * 0.5); //0
                    battleScreen.add(cameraFieldsOffset + 4).writeFloat((mapHeight * -0.5) + (mapHeight * 5.0) * chair); //1
                    battleScreen.add(cameraFieldsOffset + 8).writeFloat(mapHeight + 4.0451); //2
                    battleScreen.add(cameraFieldsOffset + 12).writeFloat(mapWidth * 0.5); //3
                    battleScreen.add(cameraFieldsOffset + 16).writeFloat(mapHeight * -0.5); //4
                    battleScreen.add(cameraFieldsOffset + 20).writeFloat(0.0); //5
                    break;

                case 3:
                    battleScreen.add(cameraFieldsOffset).writeFloat(battleScreen.add(cameraFieldsOffset).readFloat() - battleScreen.add(cameraFieldsOffset).readFloat() - battleScreen.add(cameraFieldsOffset + 12).readFloat() + Configuration.cameraRotateX + posX); //0 battleScreen.add(1672).readFloat() - battleScreen.add(1672).readFloat() - battleScreen.add(1684).readFloat() + posX
                    battleScreen.add(cameraFieldsOffset + 4).writeFloat(battleScreen.add(cameraFieldsOffset + 4).readFloat() - Configuration.cameraRotateY - posY - battleScreen.add(cameraFieldsOffset + 16).readFloat()); //1 battleScreen.add(1676).readFloat() - posY - battleScreen.add(1688).readFloat()
                    battleScreen.add(cameraFieldsOffset + 8).writeFloat(Configuration.cameraRotateY); //2
                    battleScreen.add(cameraFieldsOffset + 12).writeFloat(Configuration.cameraX); //3
                    battleScreen.add(cameraFieldsOffset + 16).writeFloat(Configuration.cameraAlign); //4 -posY
                    battleScreen.add(cameraFieldsOffset + 20).writeFloat(Configuration.cameraDistance); //5
                    //battleScreen.add(1696).writeFloat(Configuration.cameraZ); //5
                    // TEST: 1696
                    break;

            }
        });

        Interceptor.replace(BattleScreen_isAFK, new NativeCallback(function (battleScreen) {
            const isAfk = BattleScreen_isAFK(battleScreen);

            if (isAfk && Configuration.antiAFK) {
                const logicBattleModeClient = BattleMode.getLogic();
                const ownGameObject = LogicBattleModeClient.getOwnCharacter(logicBattleModeClient);
                if (ownGameObject.isNull()) {
                    return 0;
                }

                const input = new ClientInput(ClientInputType.Movement);
                input.setXY(LogicGameObjectClient.getX(ownGameObject), LogicGameObjectClient.getY(ownGameObject));
                ClientInputManager.addInput(input);

                battleScreen.add(afkWarningOffset).writeInt(0);
                return 0;
            }

            return isAfk;
        }, 'bool', ['pointer']));
    }
}
