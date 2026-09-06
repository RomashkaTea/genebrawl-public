import {LogicDefines} from "../../LogicDefines";
import {Configuration} from "../../gene/Configuration";
import {GradientNickname} from "../../gene/features/GradientNickname";
import {Libg} from "../../libs/Libg";
import {LogicVersion} from "../LogicVersion";

const StringTable_getString = new NativeFunction( // "%s texts not yet loaded"
    Libg.offset(0x812234, 0x376D08), 'pointer', ['pointer']
);

const StringTable_getCurrentLanguageCode = new NativeFunction( // "TID_ADDITIONAL_GEM_TOOLTIP_FOR_JAPAN"
    Libg.offset(0x812530, 0x376FF0), 'pointer', []
);

export class StringTable {
    static TID_ABOUT: Array<string> = [
        `<cae00ff> Gene Brawl ${LogicVersion.getEnvironment().toUpperCase()}`,
        `Telegram: t.me/gene_land`,
        ``,
        `Developers team:</c>`,
        `${GradientNickname.getPlayerGradient("P9JGPPLYQ")}                         ${GradientNickname.getPlayerGradient("8GCQYL2VL")}`,
        ``,
        `${GradientNickname.getPlayerGradient("VPYGJVJ0")}                              ${GradientNickname.getPlayerGradient("2RGGJPLQU")}                              ${GradientNickname.getPlayerGradient("QUJPVU0L")}`,
        `<cae00ff>Script version: ${LogicVersion.getScriptVersion()}`,
        `Game version: v${LogicVersion.toDebugString()}`,
        `Platform: ${LogicDefines.toString()}</c>`
    ];

    static patch() {
        Interceptor.replace(StringTable_getString, new NativeCallback(function (tid) {
            let str = tid.readUtf8String();

            switch (str) {
                case "TID_CREDITS_BUTTON":
                    return "About Mod".scptr();
                case "TID_ABOUT":
                    return StringTable.TID_ABOUT.join("\n").scptr();
                case "TID_CLASS_ARCHETYPE_TANK_PLURAL":
                    if (StringTable.getCurrentLanguageCode() == "RU") {
                        return "ТЯНКИ".scptr();
                    }
                default:
                    return StringTable_getString(tid);
            }
        }, 'pointer', ['pointer']));
    }

    static getCurrentLanguageCode(): string {
        return StringTable_getCurrentLanguageCode().fromsc();
    }

    static getString(textId: string): string {
        return StringTable_getString(textId.ptr()).fromsc();
    }
}
