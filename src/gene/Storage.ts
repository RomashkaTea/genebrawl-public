import {GlobalID} from "../logic/data/GlobalID";
import {PopupBase} from "../titan/flash/gui/PopupBase";

export class Storage {
    static popups: PopupBase[] = [];
    static serverThemeId: number = GlobalID.createGlobalID(41, 0);

    static freePopups() {
        Storage.popups = [];
    }

    static addPopup(popup: PopupBase) {
        Storage.popups = Storage.popups.filter(e => e.constructor !== popup.constructor);
        Storage.popups.push(popup);
    }

    static getPopup(popup: PopupBase) {
        return Storage.popups.find(e => e.constructor === popup.constructor);
    }

    static removePopupByInstance(instance: NativePointer) {
        Storage.popups = Storage.popups.filter(e => !e.instance.equals(instance));
    }
}
