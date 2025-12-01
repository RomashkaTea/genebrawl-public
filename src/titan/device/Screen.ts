import {Libg} from "../../libs/Libg";

const Screen_getWidth = new NativeFunction( // ios: "screenWidth" | %s?time=%d
    Libg.offset(0xBC5A84, 0xBA3524), 'float', []
);
const Screen_getHeight = new NativeFunction( // ios: "screenHeight" | %s?time=%d
    Libg.offset(0xBC5A90, 0xBA3530), 'float', []
);

export class Screen {
    static getWidth(): number {
        return Screen_getWidth();
    }

    static getHeight(): number {
        return Screen_getHeight();
    }

    static toString() {
        return `Screen(width=${Screen.getWidth()}, height=${Screen.getHeight()})`;
    }
}
