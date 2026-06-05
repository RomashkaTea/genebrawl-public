import {GUI} from "../titan/flash/gui/GUI";
import {INativeDialogListener} from "../titan/utils/INativeDialogListener";
import {NativeDialog} from "../titan/utils/NativeDialog";
import {RGBA} from "./features/RGBA";
import {BlackListScreen} from "./popups/BlackListScreen";

const libc = Module.getGlobalExportByName('opendir');
const readdir = Module.getGlobalExportByName('readdir');
const closedir = Module.getGlobalExportByName('closedir');

export class TestCase {
    static async doCase() {

    }

    static test() {

    }

    static dialogListener: INativeDialogListener = new INativeDialogListener(TestCase.listenerTest);

    static nativeDialogListenerTest() {
        NativeDialog.showNativeDialog(TestCase.dialogListener, "Hello world!", "Press da button", "guacamole", "bomb", 'penis');
    }

    static listenerTest(listener: NativePointer, buttonIndex: number) {
        GUI.showFloaterText("You pressed on " + buttonIndex + "!", RGBA.green);
    }

    static testFileExists() {
        /// #if DEBUG
        //let json = File.readAllText("/data/user/0/com.supercell.brawlstarts/assets/");
        const opendir = new NativeFunction(libc!, 'pointer', ['pointer']);
        const readDir = new NativeFunction(readdir!, 'pointer', ['pointer']);
        const closeDir = new NativeFunction(closedir!, 'int', ['pointer']);

        const dirPath = Memory.allocUtf8String('/data/user/0/com.supercell.brawlstarts/update/badge');
        const dirPointer = opendir(dirPath);

        if (!dirPointer.isNull()) {
            console.log(`Opened directory: ${dirPath.readUtf8String()}`);
            let dirEntry = readDir(dirPointer);
            console.log(hexdump(dirEntry, { length: 128 * 4 }));
            closeDir(dirPointer);
            console.log('Closed directory');
        } else {
            console.error('Failed to open directory');
        }
        /// #endif
    }

    static createBlackListScreen() {
        /// #if DEBUG
        const screen = new BlackListScreen();

        screen.setXy();

        GUI.showPopup(screen.instance, 0, 0, 0);
        /// #endif
    }
}
