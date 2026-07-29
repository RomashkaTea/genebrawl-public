import {Configuration} from "../Configuration";
import {Libg} from "../../libs/Libg";
import {LogicData} from "../../logic/data/LogicData";
import {Mathematics} from "../../utils/Mathematics";
import {IPatchable} from "../../utils/IPatchable";

interface Nicknames { [key: string]: string; }

const LogicPlayerTitleData_getTitleTID = new NativeFunction( // "TitleTID"
    Libg.offset(0x0, 0x404500), 'pointer', ['pointer']
);

// TODO: Custom titles for geneteam members

export class GradientNickname {
    static patch() {
        this.patchGradients();
    }
    static players: Nicknames = {
        "P9JGPPLYQ": "<c0095ff>R<c00aaff>o<c00bfff>m<c00d4ff>a<c00e9ff>s<c00fefe>h<c00d4ff>k<c00aaff>a<c007fff>G<c0055ff>e<c002aff>n<c0004fe>e</c>", // prod
        "82Y9YL-stage": "<cff002a>R<cff0054>o<cff007f>m<cff00a9>a<cff00d4>s<cfe00fe>h<cd400ff>k<caa00ff>a<c7f00ff>G<c5500ff>e<c2a00ff>n<c0400fe>e</c>", // stage
        "82YQPP-stage": "<cff002a>R<cff0054>o<cff007f>m<cff00a9>a<cff00d4>s<cfe00fe>h<cd400ff>k<caa00ff>a<c7f00ff>G<c5500ff>e<c2a00ff>n<c0400fe>e</c>", // stage
        "UCVL2GUV": "<cff003f>h<cff007f>p<cff00bf>d<cff00ff>e<cbf00ff>v</c>", // hpdev
        "8GCQYL2VL": "<cff891b>h<cff9b37>p<cffac53>d<cffbe6f>e<cffce93>v<cffdeb7>f<cffeedb>o<cfffff1>x</c>", // hpdev
        "VPYGJVJ0": "<cff002a>k<cff0054>i<cff007f>t<cff00a9>e<cff00d4>n<cfe00fe>o<cff00ff>k<cd400ff>g<caa00ff>e<c7f00ff>n<c5500ff>e</c>", // kitenokgene
        "YPCCCJCU": "<cff003f>T<cff007f>o<cff00bf>y<cff00ff>t<cff00ff>y<cbf00ff>i<c7f00ff>s</c>", // toytyis
        "2RGGJPLQU": "<cba0000>t<cd10000>a<ce80000>i<cff0000>l<cff0000>s<cd40006>j<caa010c>s</c>", // tailsjs main (prod)
        "8JGP090P": "<cc20000>Т<ce00000>е<cff0000>й<cff0000>л<cc60008>з</c>", // tailsjs alt (prod)
        "880GGPPL": "<c0032ff>U<c0065ff>m<c0098ff>o<c00cbff>r<c00ffff>i<c00ffff>s<c00ffcc>t<c00ff99>4<c00ff66>7</c>", // umorist
        "QUJPVU0L": "<cdb84fe>B<cd377fe>r<ccb69fe>e<cc45cfe>a<ccf77fe>d<cda92fe>D<ce5adfe>E<cf1c9fe>V</c>", // prod (bread main)
        "PQL90VLR9": "<ccf27c7>B<cdf1ada>r<cef0dec>e<cff00ff>a<cca04eb>d<c9609d7>D<c610dc3>E<c2d12af>V</c>", // prod (bread alt)
        "Y8UGUCPY9": "<cffff24>A<cffff48>z<cffff6d>o<cfefe91>t<cffffb6>i<cffffda>c<cfffffe>a<cfffff1>l<cfffada>L<cfff5b6>i<cfff091>g<cfeeb6d>h<cffe648>t</c>", // AzoticalLight
        "PL2RU2U": "<ce6a4fe>З<cebb6fe>а<cf0c8fe>р<cf5dafe>в<cfaecfe> <cfefefe>ф<cffffff>е<cfaecfe>м<cf5dafe>б<cf0c8fe>о<cebb6fe>й</c> 💞", // Zarv
        "9VUR0YR8J": "<cFF0000>B<c00FF99>O<cFF3366>O<c9900FF>K<c00CC33>L<c00FFFF>O<cFF3399>G<cFFFF00>I<c66FF33>N</c>", // BOOKLOGIN
        "9P0R2YC2Q": "<cfde423>H<cfdd509>e<cfdbf01>d<cfea603>g<cfe9304>e</c>", // Hedge,
        "9PJ0L99UV": "<cff7b1c>м<cff8623>и<cff922a>м<cff9d30>и<cffa937>м<cffb43e>а<cffc045>м<cffcb4b>о<cffd752>м<cffe259>у</c>", //старый мой должок
        "20V9U2CYR0": "<c002aff>к<c0054ff>о<c007fff>к<c00a9ff>с<c00d4ff> <c00fefe>4<c00ffd4>8<c00ffaa> <c00ff7f>г<c00ff55>р<c00ff2a>а<c00fe04>м</c>",
        "82LVCQCRG": "<ce1429b>l<cdc49bc>o<cd750dd>s<cd357fe>t<cac63fe>o<c866ffe>s<c607bfe>h<c3a87fe>a</c>",
        "P8LCCRJ2C": "<c2a2aff>C<c5454ff>H<c7f7fff>I<ca9a9ff>T<cd4d4ff>A<cfefefe>V<cffffff>A<cffd4ff>G<cffaaff>E<cff7fff>N<cff55ff>E</c>🦽",
        "2VYYGUUJQ": "<c0423ff>Б<c0423ff>у<cfcff01>с<cfcff01>т</c>",
        "282LG9LYG": "<cff0032>я<cff0065> <cff0098>т<cff00cb>я<cff00ff>н<cff00ff>о<ccc00ff>ч<c9900ff>к<c6600ff>а</c>",
        "8JPY9VV8G": "<cc4eacc>B<cd2e8d0>a<ce0e6d5>d<ceee4d9>Z<cfde2de>i<cfde2de>k<cf4cfdb>o<cebbcd8>s<ce2aad5>?</c>",
        "P9UJ8PPV8": "<cff0032>r<cff0065>e<cff0098>:<cff00cb>:<cff00ff>T<ccc00ff>h<c9900ff>K<c6600ff> <c3300ff>:<c0100ff>3</c>",
        "UPPR2RL0": "<c3d263b>B<c682341>O<c932047>O<cbf1d4d>K<cea1b53>L<cea1b53>O<ce93365>G<ce94b77>I<ce96289>N</c>",
        "9809CPUU2": "<ca1b8ff>W<c8aa7ff>i<c7396ff>s<c5c85ff>i<c789aff>x<c94afff></c> 🪐"
    };

    private static clubs: Nicknames = {
        "2RYV0LVCQ": "<caa00f9>G<cbb00f3>e<ccc00ee>n<cdd00e8>e<ced00e2>'<cfe00dc>s<cff00dd> <cf500e2>L<cec00e8>a<ce300ee>n<cda00f3>d</c>"
    };

    private static titles: Nicknames = {
        "P9JGPPLYQ": "Коляска-тян",
        "8GCQYL2VL": "лисичковое",
        "2RGGJPLQU": `Выпил ${Mathematics.random(1500, 250000)} литров пива`,
        "8JGP090P": "async/await",
        "VPYGJVJ0": "💎 тян",
        "QUJPVU0L": "хлебные разработки"
    };

    static setPlayerGradient(tag: string, nicknamePtr: NativePointer) {
        if (Configuration.useStage) {
            tag += "-stage";
        }

        if (Object.prototype.hasOwnProperty.call(Configuration.accountNames, tag)) {
            nicknamePtr.scptr(Configuration.accountNames[tag]);
        }

        if (GradientNickname.doPlayerHaveGradient(tag)) {
            nicknamePtr.scptr(GradientNickname.players[tag]);
        }
    }

    static setClubGradient(tag: string, nicknamePtr: NativePointer) {
        if (Configuration.useStage) {
            tag += "-stage";
        }

        if (Object.prototype.hasOwnProperty.call(GradientNickname.clubs, tag)) {
            nicknamePtr.scptr(GradientNickname.clubs[tag]);
        }
    }

    static getPlayerGradient(tag: string) {
        if (GradientNickname.doPlayerHaveGradient(tag)) {
            return GradientNickname.players[tag];
        } else {
            console.log("GradientNickname.getPlayerGradient:", "Player with", tag, "tag doesn't have assigned gradient!");

            return "";
        }
    }

    static doPlayerHaveTitle(tag: string): boolean {
        return Object.prototype.hasOwnProperty.call(GradientNickname.titles, tag);
    }

    static doPlayerHaveGradient(tag: string): boolean {
        return Object.prototype.hasOwnProperty.call(GradientNickname.players, tag);
    }

    static getPlayerTitleIndex(tag: string) {
        if (!GradientNickname.doPlayerHaveTitle(tag)) {
            console.log(`GradientNickname.getPlayerTitleIndex(${tag})`, "-", "Player doesn't have title.");
            return -1;
        }

        return Object.keys(GradientNickname.titles).indexOf(tag);
    }

    static patchGradients() {
        // Patching TitleTIDs

        Interceptor.replace(LogicPlayerTitleData_getTitleTID, new NativeCallback(function (playerTitleDataPtr) {
            const instanceId = LogicData.getInstanceId(playerTitleDataPtr);

            if (instanceId - 1000 >= 0) {
                const owner = Object.keys(GradientNickname.titles)[instanceId - 1000];
                return GradientNickname.titles[owner].scptr();
            }

            return LogicPlayerTitleData_getTitleTID(playerTitleDataPtr);
        }, "pointer", ["pointer"]));
    }
}
