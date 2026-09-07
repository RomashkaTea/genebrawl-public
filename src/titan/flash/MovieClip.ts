import {Sprite} from "./Sprite";
import {Libg} from "../../libs/Libg";
import {TextField} from "./TextField";

const MovieClip_getChildByName = new NativeFunction( // "tap_area" (char const)
    Libg.offset(0xA4D884, 0x9AADC8), 'pointer', ['pointer', 'pointer']
);

const MovieClip_getTextFieldByName = new NativeFunction( // "TID_LINK_CODE_WARNING_TEXT"
    Libg.offset(0xA4EEE8, 0x9AC2CC), 'pointer', ['pointer', 'pointer']
);

const MovieClip_setChildVisible = new NativeFunction( // "brawler_name_blue";
    Libg.offset(0xA4F49C, 0x9AC848), 'void', ['pointer', 'pointer', 'bool']
);

const MovieClip_setText = new NativeFunction( // "TID_CLAN_INTRO_CREATE_TITLE"
    Libg.offset(0xA4F0F4, 0x9AC4CC), 'void', ['pointer', 'pointer', 'pointer']
);

const MovieClip_playOnce = new NativeFunction( // "not able to find free floater text slot"
    Libg.offset(0xA4F528, 0x9AC8CC), 'void', ['pointer']
);

const MovieClip_stop = new NativeFunction( // "battle_end_replay_screen_"
    Libg.offset(0xA4EBB4, 0x9AB9C0), 'void', ['pointer']
);

const MovieClip_setFrame = new NativeFunction( // inside ::playOnce
    Libg.offset(0xA4BA54, 0x9A8FE0), 'void', ['pointer', 'int']
);

const MovieClip_getNameOfChild = new NativeFunction( // *rubbing hands* ": texts not yet loaded" (function MUST BE with string "TID_"), then xref, and function below is this shit.
    Libg.offset(0x8129B8, 0x37732C), 'pointer', [ 'pointer', 'pointer', 'pointer' ]
)

const MovieClip_getFrameIndex = new NativeFunction( // below "xp_%d_end"
    Libg.offset(0xA4E194, 0x9AB628), 'int', [ 'pointer', 'pointer' ]
)

const MovieClip_gotoAndStopFrameIndex = new NativeFunction( // func below "TID_DEVICE_LINK_CODE_BUTTON_LINK"
    Libg.offset(0xA4DDFC, 0x9AB2F8), 'void', [ 'pointer', 'int' ]
)

const MovieClip_gotoAndPlayFrameIndex = new NativeFunction( // "TID_GATCHA_SCREEN_TAP", functions with 2 and 4 args - 0
    Libg.offset(0xA4DD10, 0x9AB218), 'void', [ 'pointer', 'int', 'int', 'int' ]
)

// t.me/gene_land

const MovieClip_childrenArray = 112; //first pointer in return MovieClip::getChildByName
const MovieClip_childrenCount = 176;
const MovieClip_currentFrame = 144;

export class MovieClip extends Sprite {
    constructor(instance: NativePointer) {
        super(instance);
    }

    getChildByName(name: string): MovieClip {
        return new MovieClip(
            MovieClip_getChildByName(this.instance, name.ptr())
        );
    }

    getChildById(index: number): MovieClip {
        return new MovieClip(
            this.instance.add(MovieClip_childrenArray).readPointer().add(index * Process.pointerSize).readPointer()
        );
    }

    getChildAmount() {
        return this.instance.add(MovieClip_childrenCount).readS16()
    }

    getFrameIndex(frameName: string) {
        return MovieClip_getFrameIndex(this.instance, frameName.scptr())
    }

    gotoAndPlayFrameIndex(frameIndex: number, frameIndexEnd: number) {
        MovieClip_gotoAndPlayFrameIndex(this.instance, frameIndex, frameIndexEnd, 0)
    }

    gotoAndStopFrameIndex(frameIndex: number) {
        MovieClip_gotoAndStopFrameIndex(this.instance, frameIndex)
    }

    getCurrentFrame() {
        return this.instance.add(MovieClip_currentFrame).readInt()
    }

    getNameOfChild (child: MovieClip) {
        const str = NULL;
        const childName = MovieClip_getNameOfChild(this.instance, child.instance, str)

        try {
            return childName.readUtf8String()
        } catch (e) {
            return ""
        }
    }

    getTextFieldByName(name: string) {
        const ptr = MovieClip_getTextFieldByName(this.instance, name.ptr());
        return !ptr.isNull() ? new TextField(ptr) : null;
    }

    setChildVisible(name: string, state: boolean) {
        MovieClip_setChildVisible(this.instance, name.ptr(), Number(state));
    }

    setText(exportName: string, txt: string) {
        MovieClip_setText(this.instance, exportName.ptr(), txt.scptr());
    }

    playOnce() {
        MovieClip_playOnce(this.instance);
    }

    stop() {
        MovieClip_stop(this.instance);
    }

    setFrame(index: number)  {
        MovieClip_setFrame(this.instance, index);
    }
}
