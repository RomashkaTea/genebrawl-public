import {Libg} from "../../../libs/Libg";
import {Configuration} from "../../../gene/Configuration";
import {Armceptor} from "../../../utils/Armceptor";
import {GameStateManager} from "../../../laser/client/state/GameStateManager";
import {LogicDefines} from "../../../LogicDefines";

const TeamManager_resolveStatus = new NativeFunction(  // "Changed non-team status: %i, slot: %i"
    Libg.offset(0x4FDE4C, 0xDF18C), 'int', []
);

const TeamManager_isPlayerReady = new NativeFunction( // func after TeamManager::instance
    Libg.offset(0x4FD63C, 0xDE9F4), 'int', ['pointer']
);

const TeamManager_checkIsReadyAndPrint = new NativeFunction( // TODO
    Libg.offset(0x7CCCD4, 0x337FA8), 'void', ['pointer']
);                  // maybe ^ (it was rewritten as i can say)

const TeamManager_openTeamChat = new NativeFunction(
    Libg.offset(0x7978D4, 0x3112A0), 'void', [] // "NEW_TEAM_CHAT"
);
// 4FD790
const TeamManager_instance = Libg.offset(0x103D9A8, 0xEE6200); // 1st dword after "HomePageTeamMember::onSpeechBubblePressed() missing chat entry"

const TeamManager_onTeamStream_JUMPOUTFROM = Libg.offset(0x4FF0D0, -1); // "Got team stream message %i"
const TeamManager_onTeamStream_JUMPOUTTO = Libg.offset(0x4FF0EC, -1); // "Got team stream message %i"

const TeamManager_patch1 = Libg.offset(0x798784, -1);  // if (v9 === 1) (asm: CMP W8, #1)
const TeamManager_patch2 = Libg.offset(0x79BDD0, -1); // if (v5 == 5) (asm: CMP W22, #5) ("TeamChatPinned")


export class TeamManager {
    static getInstance() {
        return TeamManager_instance.readPointer();
    }

    static patch(): void {
        Interceptor.replace(TeamManager_resolveStatus, new NativeCallback(function () {
            let status = TeamManager_resolveStatus();

            if (status == 1 && Configuration.hideBattleState)
                status = 3;
            else if (Configuration.preferredStatus != -1)
                status = Configuration.preferredStatus;

            return status;
        }, 'int', []));

        Interceptor.replace(TeamManager_isPlayerReady, new NativeCallback(function (teamManager) {
            return 0;
        }, 'int', ['pointer']));

        Interceptor.replace(TeamManager_checkIsReadyAndPrint, new NativeCallback(function (teamManager) {
            return 0;
        }, 'void', ['pointer']));

        if (!LogicDefines.isPlatformIOS()) {
            Armceptor.jumpout(TeamManager_onTeamStream_JUMPOUTFROM, TeamManager_onTeamStream_JUMPOUTTO);

            Interceptor.attach(TeamManager_patch1, function () {
                const check = (this.context as Arm64CpuContext);

                if (check.x8.equals(1) && !GameStateManager.isHomeMode()) {
                    (this.context as Arm64CpuContext).x8 = NULL;
                }
            });
            if (LogicDefines.isPlatformIOS()) {
                Interceptor.attach(TeamManager_patch2, function () {
                    const check = (this.context as Arm64CpuContext);

                    if (check.x22.equals(5) && !GameStateManager.isHomeMode()) {
                        (this.context as Arm64CpuContext).x22 = NULL;
                    }
                });
            }
        }
        else {
            console.warn("Memory.patchCode will not work on iOS!!! Find another way to patch this. да мне похуй бля");
        }
    }

    static openTeamChat() {
        TeamManager_openTeamChat(); // maybe rewrite function, so we can close chat on battleend?
    }
}
