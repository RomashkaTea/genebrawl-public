import { GradientNickname } from "../../../gene/features/GradientNickname";
import { Libg } from "../../../libs/Libg";
import { HashTagCodeGenerator } from "../../../titan/logic/util/HashTagCodeGenerator";

const TeamMemberEntry_decode = new NativeFunction(
    Libg.offset(0x972E84, 0x47FB0C), 'void', ['pointer', 'pointer'] // 24124
);

const TeamMemberItem_setMember = new NativeFunction( // "button_slot_switch"
    Libg.offset(0x651C8C, 0x1FF388), 'void', ['pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer']
);

const TeamMemberEntry_memberIdOffset = 8;
const TeamMemberEntry_PlayerDisplayDataOffset = 80;

export class TeamMemberEntry {
    static patch() {
        Interceptor.replace(TeamMemberEntry_decode, new NativeCallback(function (teamMemberEntry, byteStream) {
            TeamMemberEntry_decode(teamMemberEntry, byteStream);

            const memberId = teamMemberEntry.add(TeamMemberEntry_memberIdOffset).readPointer();
            const memberTag = HashTagCodeGenerator.toCode(memberId);

            const playerDisplayData = teamMemberEntry.add(TeamMemberEntry_PlayerDisplayDataOffset).readPointer();

            GradientNickname.setPlayerGradient(memberTag, playerDisplayData);
        }, 'void', ['pointer', 'pointer']));

        Interceptor.replace(TeamMemberItem_setMember, new NativeCallback(function (teamMemberItem, a2, a3, a4, a5, a6, isOwn, a8) {
            isOwn = ptr(1);

            TeamMemberItem_setMember(teamMemberItem, a2, a3, a4, a5, a6, isOwn, a8);
        }, 'void', ['pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer']));
    }
}

