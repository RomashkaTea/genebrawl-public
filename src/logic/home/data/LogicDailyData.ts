import {Libg} from "../../../libs/Libg";
import {Configuration} from "../../../gene/Configuration";
import {HomeMode} from "../HomeMode";

const LogicDailyData_isBrawlPassPremiumUnlocked = new NativeFunction( // higher "TID_HERO_INFO_LOCKED_BP_TIER_OWNED_INFO_SHORT"
    Libg.offset(0x99B008, 0x49AB94), 'bool', ['pointer']
);

export const LogicDailyData_hasUnlockedSkin = new NativeFunction(
    Libg.offset(0x9989B0, 0x49976C), 'bool', ['pointer', 'pointer']
); // "price_legendary_trophies"

export const selectedSkinsOffset = 72;

export class LogicDailyData {
    static patch(): void {
        Interceptor.replace(LogicDailyData_isBrawlPassPremiumUnlocked, new NativeCallback(function(dailyData) {
            if (Configuration.fakePremiumPass) {
                return 1;
            }

            return LogicDailyData_isBrawlPassPremiumUnlocked(dailyData);
        }, 'bool', ['pointer']));
    }
}
