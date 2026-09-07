import {RGBA} from "../../../gene/features/RGBA";
import {Libg} from "../../../libs/Libg";

const GUI_instance = Libg.offset(0x103D910, 0xEE61B8); // "TID_TEAM_SEARCH_NO_TEAM_CODE"

const GUI_showFloaterText = new NativeFunction( // "TID_TEAM_SEARCH_NO_TEAM_CODE"
    Libg.offset(0x4BA5F4, 0xA6C44), 'void', ['pointer', 'pointer', 'int', 'float']
);

const GUI_showPopup = new NativeFunction( // "TID_TEAM_AD_JOIN_FAIL_ALREADY_IN_A_TEAM" function higher
    Libg.offset(0x4BB190, 0xA734C), 'void', ['pointer', 'pointer', 'bool', 'bool', 'bool']
);

const GUI_getTopPopup = new NativeFunction( // "TID_TEAM_MEMBER_LEFT_%i" function higher
    Libg.offset(0x4BBA54, 0xA78B0), 'pointer', ['pointer']
);

const GUI_closeAllPopups = new NativeFunction( // "Got team: %i,%i", then last function in (down)
    Libg.offset(0x4BBC68, 0xA7A00), 'void', ['pointer']
);

export class GUI {
    static get instance(): NativePointer {
        return GUI_instance.readPointer();
    }

    static patch() {
        Interceptor.replace(GUI_showFloaterText, new NativeCallback(function(self, text, unk, unk2) {
            if (self.isNull()) {
                console.warn("GUI::showFloaterText", "GUI = null! SC moment.")
                return;
            }

            GUI_showFloaterText(self, text, unk, unk2);
        }, 'void', ['pointer', 'pointer', 'int', 'float']));
    }

    static showFloaterText(text: string, color: number = RGBA.white) {
        const instance = this.instance;
        if (instance.isNull())
            return;

        GUI_showFloaterText(instance, text.scptr(), color, -1); // -1 = invisible text
    }

    static showPopup(instance: NativePointer, a1: number, a2: number, a3: number) {
        GUI_showPopup(this.instance, instance, a1, a2, a3)
    }

    static closeAllPopups() {
        GUI_closeAllPopups(this.instance);
    }

    static getTopPopup(): NativePointer {
        const instance = this.instance;
        if (instance.isNull())
            return NULL;

        return GUI_getTopPopup(instance);
    }
}
