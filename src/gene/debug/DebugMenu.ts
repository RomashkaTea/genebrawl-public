import {GameMain} from "../../laser/client/GameMain";
import {GameButton} from "../../titan/flash/gui/GameButton";
import {FlutterSCIDManager} from "../../titan/nativescid/FlutterSCIDManager";
import {ResourceManager} from "../../titan/ResourceManager";
import {Configuration} from "../Configuration";
import {Debug} from "../Debug";
import {DebugCommandButton} from "./DebugCommandButton";
import {DebugMenuBase} from "./DebugMenuBase";
import {DebugMenuCategory, EDebugCategory} from "./DebugMenuCategory";
import {MovieClip} from "../../titan/flash/MovieClip";
import {LogicVersion} from "../../logic/LogicVersion";
import {MessageManager} from "../../laser/client/network/MessageManager";
import {ClientInput, ClientInputType} from "../../logic/battle/ClientInput";
import {ClientInputManager} from "../../logic/battle/ClientInputManager";
import {BattleMode} from "../../logic/battle/BattleMode";
import {GUI} from "../../titan/flash/gui/GUI";
import {LocalizationManager} from "../../gene/localization/index";
import {TeamSpam} from "../features/TeamSpam";
import {ToggleDebugClickerButton} from "./ToggleDebugClickerButton";
import {LatencyManager} from "../../laser/client/network/LatencyManager";
import {GameSettings} from "../../laser/client/GameSettings";
import {SpectateByTagPopup} from "../popups/SpectateByTagPopup";
import {LogicDataTables} from "../../logic/data/LogicDataTables";
import {LogicThemeData} from "../../logic/data/LogicThemeData";
import {Resources} from "../Resources";
import {GameStateManager} from "../../laser/client/state/GameStateManager";
import {RGBA} from "../features/RGBA";
import {OpenUrlPopup} from "../popups/OpenUrlPopup";
import {TextField} from "../../titan/flash/TextField";
import {Settings} from "../../laser/client/Settings";
import {Braille} from "../features/Braille";
import {HomeScreen} from "../../logic/home/HomeScreen";
import {LogicDefines} from "../../LogicDefines";
import {StringTable} from "../../logic/data/StringTable";
import {StartSpectateMessage} from "../../logic/message/battle/StartSpectateMessage";
import {LogicRevealMutationCommand} from "../../logic/command/LogicRevealMutationCommand";
import {HomeMode} from "../../logic/home/HomeMode";
import {GlobalID} from "../../logic/data/GlobalID";
import {Storage} from "../Storage";
import {LogicData} from "../../logic/data/LogicData";
import {ToggleDebugMenuButton} from "./ToggleDebugMenuButton";
import {ProfileByTagPopup} from "../popups/ProfileByTagPopup";
import {NativeDialog} from "../../titan/utils/NativeDialog";
import {UsefulInfo} from "../features/UsefulInfo";
import {DVD} from "../features/DVD";
import {PlayAgainMessage} from "../../logic/message/battle/PlayAgainMessage";
import {TestCase} from "../TestCase";
import {IButtonListener} from "../../titan/flash/gui/IButtonListener";
import {GeneAssets} from "../GeneAssets";
import {ClientInfoMessage} from "../../logic/message/udp/ClientInfoMessage";
import {NativeHTTPClient} from "../../titan/utils/NativeHTTPClient";
import {Path} from "../../titan/Path";
import {DebugDangerousFunctionPopup} from "./DebugDangerousFunctionPopup";
import {TeamManager} from "../../logic/home/team/TeamManager";

export class DebugMenu extends DebugMenuBase {
    private readonly toggleDebugMenuButton: ToggleDebugMenuButton;
    private clicker?: ToggleDebugClickerButton;

    private brailleTimeout: NodeJS.Timeout = setTimeout(() => { }, 1);
    private darkThemeTimeout: NodeJS.Timeout = setTimeout(() => { }, 1);
    private isBrailleSwitchBegan: boolean = false;
    private isDarkThemeSwitchBegan: boolean = false;

    private static notImplementedFunctions: string[] = [

    ];

    private static notImplementedIOSFunctions: string[] = [

    ];

    private static notImplementedAndroidFunctions: string[] = [

    ];

    private static dangerousFunctions: string[] = [
        "BYPASS_ANTI_PROFANITY"
    ];

    constructor() {
        super("debug_menu");

        this.setTitle("Debug Menu");

        const textField = this.movieClip.getTextFieldByName("version")!;
        textField.setText(LogicVersion.toDebugString());
        textField.setTextColor(RGBA.color(0, 255, 15));
        this.addChild(new MovieClip(textField.instance!));

        this.toggleDebugMenuButton = new ToggleDebugMenuButton();
        this.toggleDebugMenuButton.setMovieClip(this.movieClip.getChildByName("close_button"));
        this.movieClip.addChild(this.toggleDebugMenuButton);

        try {
            const anotherMovieClip = ResourceManager.getMovieClip(Resources.GENE_DEBUG, "debug_menu");
            if (anotherMovieClip) {
                this.clicker = new ToggleDebugClickerButton();
                this.clicker.setMovieClip(anotherMovieClip.getChildById(10));

                this.movieClip.addChild(this.clicker);
                this.movieClip.addChild(anotherMovieClip.getChildById(11));
            }
        } catch (e) {
            console.error(new Error("DebugMenu::DebugMenu: background_genebrawl is missing or something else.").stack);
            // background_genebrawl.sc missing
        }

        this.createDebugMenuButton("RESTART_GAME", -1, -1, 0);

        this.createDebugMenuButton("DISABLE_SPOOF", -1, -1, 2, EDebugCategory.LATENCY);

        this.createDebugMenuButton("DEBUG_INFO", -1, -1, 2, EDebugCategory.PREVIEW);
        this.createDebugMenuButton("DEBUG_OPEN_URL", -1, -1, 2, EDebugCategory.PREVIEW);

        this.createDebugMenuButton("OPEN_ACCOUNT_SWITCHER", -1, -1, 2, EDebugCategory.SC_ID, -1, () => FlutterSCIDManager.openWindow("profile-selector"));

        this.createDebugMenuButton("ADD_RESOURCES", 1, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_GEMS", 14, 800, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("BYPASS_OUT_OF_SYNC", -1, -1, 2, EDebugCategory.ACCOUNT, Configuration.antiOutOfSync ? 1 : 0);
        this.createDebugMenuButton("REMOVE_ALL_COINS", 19, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("REMOVE_ALL_GEMS", 18, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_ALL_LVL7", 113, 7, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_ALL_LVL9", 113, 9, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_GADGETS", 114, 1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_STAR_POWERS", 114, 2, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_ONE", 72, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_MAX_ONE", 72, 1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_ALL", 23, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_MAX_ALL", 23, 1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_MAX_ALL_NO_STAR_POWERS", 23, 2, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("UNLOCK_EVENT_SLOTS", 63, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("REMOVE_HERO_SKINS", 184, 0, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_POWER", 54, 50, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_SCORE", 25, 125, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("DECREASE_SCORE", 26, -50, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("CLAIM_35_MILESTONES", 154, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_1_WINSTREAK", 210, 1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_10_WINSTREAK", 210, 10, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_100_WINSTREAK", 210, 100, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("REMOVE_WINSTREAK", 211, -1, 2, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("ADD_1000_BLINGS", 182, 1000, 2, EDebugCategory.ACCOUNT);

        // not needed yet. this.createDebugMenuButton("Reveal Angel Mutation", -1, -1, 0, EDebugCategory.ACCOUNT);
        // not needed yet. this.createDebugMenuButton("Reveal Demon Mutation", -1, -1, 0, EDebugCategory.ACCOUNT);
        this.createDebugMenuButton("HIDE_SIDE_MASK", -1, -1, 0, EDebugCategory.GFX, Configuration.showSidemask ? 0 : 1);
        this.createDebugMenuButton("DARK_THEME", -1, -1, 0, EDebugCategory.GFX, Configuration.darkTheme ? 1 : 0);
        this.createDebugMenuButton("SHOW_EDIT_CONTROLS", -1, -1, 0, EDebugCategory.GFX, Configuration.showEditControls ? 1 : 0);
        this.createDebugMenuButton("SHOW_BATTLE_SHORTCUTS", -1, -1, 0, EDebugCategory.GFX, Configuration.showBattleShortcuts ? 1 : 0);
        //this.createDebugMenuButton("Win match", 35, -1, 0, EDebugCategory.BATTLE);
        this.createDebugMenuButton("AUTO_AIM", -1, -1, 0, EDebugCategory.BATTLE, Configuration.autoAim ? 1 : 0);
        this.createDebugMenuButton("AUTO_ULTI", -1, -1, 0, EDebugCategory.BATTLE, Configuration.autoUlti ? 1 : 0);
        this.createDebugMenuButton("AUTO_HYPERCHARGE", -1, -1, 0, EDebugCategory.BATTLE, Configuration.autoOvercharge ? 1 : 0);
        this.createDebugMenuButton("HOLD_TO_SHOOT", -1, -1, 0, EDebugCategory.BATTLE, Configuration.holdToShoot ? 1 : 0);
        this.createDebugMenuButton("AUTO_MOVE_TO_TARGET", -1, -1, 0, EDebugCategory.BATTLE, Configuration.moveToTarget ? 1 : 0);
        this.createDebugMenuButton("FOLLOW_CLOSEST_TEAMMATE", -1, -1, 0, EDebugCategory.BATTLE, Configuration.moveToAlly ? 1 : 0);
        this.createDebugMenuButton("AUTO_PLAY_AGAIN", -1, -1, 0, EDebugCategory.BATTLE, Configuration.autoPlayAgain ? 1 : 0);
        this.createDebugMenuButton("SEND_EMPTY_EMOTE", -1, -1, 1, EDebugCategory.BATTLE);
        this.createDebugMenuButton("SKIP_REPLAY_INTRO", -1, -1, 1, EDebugCategory.BATTLE, Configuration.skipReplayIntro ? 1 : 0);
        this.createDebugMenuButton("SKIP_BATTLE_END_REPLAY", -1, -1, 1, EDebugCategory.BATTLE, Configuration.skipBattleEndReplay ? 1 : 0);
        this.createDebugMenuButton("AUTO_READY", -1, -1, 1, EDebugCategory.BATTLE, Configuration.autoReady ? 1 : 0);
        this.createDebugMenuButton("BATTLE_SETTINGS", -1, -1, 0, EDebugCategory.BATTLE);
        this.createDebugMenuButton("SHOW_CHAT_BUTTON", -1, -1, 0, EDebugCategory.BATTLE, Configuration.showChatButton ? 1 : 0);

        this.createDebugMenuButton("SHOW_ENEMY_AMMO", -1, -1, 1, EDebugCategory.BATTLE, Configuration.showEnemyAmmo);
        this.createDebugMenuButton("STOP_LOLA_CLONE", -1, -1, 1, EDebugCategory.BATTLE, Configuration.lolaControlState !== 0);

        this.createDebugMenuButton("ADD_BRAWL_PASS_POINTS_THIS_SEASON", 81, 50, 2, EDebugCategory.BRAWL_PASS);
        this.createDebugMenuButton("ADD_CHAMPIONSHIP_CHALLENGE_WIN", 84, 1, 2, EDebugCategory.CHALLENGE);
        this.createDebugMenuButton("ADD_CHAMPIONSHIP_CHALLENGE_LOSS", 95, 1, 2, EDebugCategory.CHALLENGE);
        this.createDebugMenuButton("SET_CC_ESPORTS_QUALIFIED", 102, 1, 2, EDebugCategory.CHALLENGE);
        this.createDebugMenuButton("REMOVE_CC_ESPORTS_QUALIFIED", 103, 1, 2, EDebugCategory.CHALLENGE);

        this.createDebugMenuButton("FORCE_CHINA_GFX_TWEAKS", -1, -1, 0, EDebugCategory.PRC_CHINA, Configuration.isChinaVersion ? 1 : 0);

        this.createDebugMenuButton("HIDE_DEBUG_ITEMS", -1, -1, 0, EDebugCategory.GFX, Configuration.showDebugItems ? 0 : 1);
        //fixme looks like it got removed too this.createDebugMenuButton("HIDE_SHOW_CONNECTION_INDICATOR", -1, -1, 0, EDebugCategory.GFX, Configuration.showConnectionIndicator ? 1 : 0);
        this.createDebugMenuButton("HIDE_TAGS", -1, -1, 0, EDebugCategory.STREAMER_MODE, Configuration.showTags ? 0 : 1);
        this.createDebugMenuButton("HIDE_NAME", -1, -1, 2, EDebugCategory.STREAMER_MODE, Configuration.showName ? 0 : 1);

        //this.createDebugMenuButton("HIDE_SHOW_FPS", -1, -1, 2, EDebugCategory.USEFUL_INFO);
        //this.createDebugMenuButton("HIDE_SHOW_AVG_FPS", -1, -1, 2, EDebugCategory.USEFUL_INFO);
        //this.createDebugMenuButton("HIDE_SHOW_MIN_FPS", -1, -1, 2, "FPS Counter");
        //this.createDebugMenuButton("HIDE_SHOW_MAX_FPS", -1, -1, 2, EDebugCategory.USEFUL_INFO);
        //this.createDebugMenuButton("HIDE_SHOW_TIME", -1, -1, 2, EDebugCategory.USEFUL_INFO);
        //this.createDebugMenuButton("HIDE_SHOW_SESSION_TIME", -1, -1, 2, EDebugCategory.USEFUL_INFO);

        this.createDebugMenuButton("START_ROOM_SPAM", -1, -1, 2, EDebugCategory.SPAM, -1, () => {
            TeamSpam.start();
        });

        this.createDebugMenuButton("STOP_ROOM_SPAM", -1, -1, 2, EDebugCategory.SPAM, -1, () => {
            TeamSpam.end();
        });


        if (!Configuration.useStage) {
            this.createDebugMenuButton("SWITCH_TO_STAGE_SERVER", -1, -1, 0, EDebugCategory.SERVERS);
        } else {
            this.createDebugMenuButton("SWITCH_TO_PROD_SERVER", -1, -1, 0, EDebugCategory.SERVERS);
        }


        this.createDebugMenuButton("UNLOCK_GEARS", 117, -1, 2, EDebugCategory.GEARS);
        this.createDebugMenuButton("UNLOCK_CURRENT_BRAWL_PASS_SEASON", 0x9F, 0, 2, EDebugCategory.BRAWL_PASS);
        this.createDebugMenuButton("UNLOCK_CURRENT_BRAWL_PASS_PLUS_SEASON", 0x9F, -1, 2, EDebugCategory.BRAWL_PASS);
        this.createDebugMenuButton("HIDE_ULTI_AIMING", -1, -1, 0, EDebugCategory.BATTLE, Configuration.showUlti ? 0 : 1);

        this.createDebugMenuButton("STATIC_BACKGROUND", -1, -1, 2, EDebugCategory.GFX, Configuration.staticBackground ? 1 : 0);
        this.createDebugMenuButton("ANTI_AFK", -1, -1, 0, EDebugCategory.BATTLE, Configuration.antiAFK ? 1 : 0);



        // Optimization
        this.createDebugMenuButton("HIDE_SPECIAL_OFFERS", -1, -1, 0, EDebugCategory.OPTIMIZATION, Configuration.specialOffers ? 0 : 1);
        this.createDebugMenuButton("CHARACTER_SOUNDS", -1, -1, 0, EDebugCategory.OPTIMIZATION, Configuration.heroSounds ? 1 : 0);

        this.createDebugMenuButton("HIDE_BRAWLERS_IN_INTRO", -1, -1, 0, EDebugCategory.OPTIMIZATION, Configuration.hideHeroesIntro ? 1 : 0);
        this.createDebugMenuButton("HIDE_LEAGUE_IN_BATTLE_CARD", -1, -1, 0, EDebugCategory.OPTIMIZATION, Configuration.hideLeagueBattleCard ? 1 : 0);
        this.createDebugMenuButton("USE_OLD_INTRO", -1, -1, 0, EDebugCategory.OPTIMIZATION, Configuration.useOldIntro ? 1 : 0);

        this.createDebugMenuButton("BYPASS_ANTI_PROFANITY", -1, -1, 0, EDebugCategory.MISC, Configuration.antiProfanity);
        this.createDebugMenuButton("CLOSE_RANKED_SCREEN", -1, -1, 0, EDebugCategory.MISC);
        this.createDebugMenuButton("PROFILE_BY_TAG", -1, -1, 0, EDebugCategory.MISC);

        //this.createDebugMenuButton("FORCE_LOWRES_TEXTURES", -1, -1, 0, EDebugCategory.OPTIMIZATION);

        this.createDebugMenuButton("SLOW_MODE", -1, -1, 0, EDebugCategory.GFX, Configuration.slowMode ? 1 : 0);
        this.createDebugMenuButton("VISUAL_CHROMATIC_NAME", -1, -1, 0, EDebugCategory.GFX, Configuration.fakePremiumPass ? 1 : 0);
        this.createDebugMenuButton("DISABLE_OUTLINE", -1, -1, 0, EDebugCategory.GFX, Configuration.drawOutline ? 0 : 1);

        this.createDebugMenuButton("EMOTE_ANIMATION", -1, -1, 0, EDebugCategory.GFX, Configuration.emoteAnimation ? 1 : 0);
        this.createDebugMenuButton("SHOW_FUTURE_EVENTS", -1, -1, 0, EDebugCategory.GFX, Configuration.showFutureEvents ? 1 : 0);
        this.createDebugMenuButton("HIDE_CREATOR_BOOST", -1, -1, 0, EDebugCategory.GFX, Configuration.contentCreatorBoost ? 0 : 1);
        this.createDebugMenuButton("SHOW_BOT_PREFIX", -1, -1, 0, EDebugCategory.GFX, Configuration.showBotPrefix ? 1 : 0);
        this.createDebugMenuButton("USE_LEGACY_BACKGROUND", -1, -1, 0, EDebugCategory.GFX, Configuration.useLegacyThemeMode);
        // FIXME this.createDebugMenuButton("SKIP_STARR_DROP_ANIMATION", -1, -1, 0, EDebugCategory.GFX, Configuration.skipRandomAnimation);
        this.createDebugMenuButton("HIDE_LOBBY_INFO", -1, -1, 0, EDebugCategory.GFX, 0);

        this.createDebugMenuButton("MOVEMENT_BASED_AUTOSHOOT", -1, -1, 0, EDebugCategory.BATTLE, Configuration.movementBasedAutoshoot ? 1 : 0);
        this.createDebugMenuButton("SPECTATE_BY_TAG", -1, -1, 0, EDebugCategory.BATTLE);
        this.createDebugMenuButton("HIDE_BATTLE_STATE", -1, -1, 0, EDebugCategory.BATTLE, Configuration.hideBattleState ? 1 : 0);
        this.createDebugMenuButton("AUTO_EXIT_AFTER_BATTLE", -1, -1, 0, EDebugCategory.BATTLE, Configuration.autoExitAfterBattle ? 1 : 0);
        this.createDebugMenuButton("MARK_FAKE_LEON", -1, -1, 0, EDebugCategory.BATTLE, Configuration.markFakeNinja ? 1 : 0);
        this.createDebugMenuButton("NEXT_CAMERA_MODE", -1, -1, -1, EDebugCategory.CAMERA_MODE);

        this.createDebugMenuButton("SHOW_FPS", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showFPS ? 1 : 0);
        this.createDebugMenuButton("SHOW_TIME", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showCurrentTime ? 1 : 0);
        this.createDebugMenuButton("SHOW_SESSION_TIME", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showSessionTime ? 1 : 0);
        this.createDebugMenuButton("SHOW_OWN_TEAM", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showTeam ? 1 : 0);
        this.createDebugMenuButton("SHOW_BATTLE_INFO", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showBattleInfo ? 1 : 0);

        this.createDebugMenuButton("SHOW_BATTLE_PING", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showBattlePing ? 1 : 0);
        this.createDebugMenuButton("SHOW_TICKS", -1, -1, 2, EDebugCategory.USEFUL_INFO, Configuration.showTicks ? 1 : 0);

        this.createDebugMenuButton("CHANGELOGS", -1, -1, 2, EDebugCategory.USEFUL_INFO);

        this.createDebugMenuButton("SFX", -1, -1, 2, EDebugCategory.GAME_SETTINGS, GameSettings.sfxEnabled);
        this.createDebugMenuButton("MUSIC", -1, -1, 2, EDebugCategory.GAME_SETTINGS, GameSettings.musicEnabled);
        this.createDebugMenuButton("HAPTICS", -1, -1, 2, EDebugCategory.GAME_SETTINGS, GameSettings.hapticsEnabled);

        this.createDebugMenuButton("NO_PROXY", -1, -1, 0, EDebugCategory.PROXY);
        this.createDebugMenuButton("Gene Proxy", -1, -1, 0, EDebugCategory.PROXY);

        this.createDebugMenuButton("PROBING_CANE_MODE", -1, -1, 0, EDebugCategory.FUN, Configuration.braille ? 1 : 0);
        this.createDebugMenuButton("ADVANCED_PROBING_CANE_MODE", -1, -1, 0, EDebugCategory.FUN, Configuration.braille_textfield ? 1 : 0);
        this.createDebugMenuButton("SPAWN_DVD", -1, -1, 0, EDebugCategory.FUN);
        this.createDebugMenuButton("REMOVE_DVD", -1, -1, 0, EDebugCategory.FUN);
        this.createDebugMenuButton("REMOVE_ALL_DVD", -1, -1, 0, EDebugCategory.FUN);

        this.createDebugMenuButton("CURRENT_SERVER_THEME", -1, -1, 0, EDebugCategory.CHANGE_THEME, Configuration.themeId == -1);

        const themeTable = LogicDataTables.getTable(41);

        for (let i = 0; i < themeTable.add(20).readU8(); i++) {
            const themeData = LogicDataTables.getDataById(41, i) as LogicThemeData;

            if (!themeData.isDisabled())
                this.createDebugMenuButton(themeData.getName(), -1, i, -1, EDebugCategory.CHANGE_THEME, Configuration.themeId == i);
        }

        this.createDebugMenuButton("STATUS_NORMAL", -1, -1, 0, EDebugCategory.CHANGE_STATUS, Configuration.preferredStatus == -1);

        for (let i = 1; i < 12; i++) {
            if (i == 6)
                continue;

            this.createDebugMenuButton(
                StringTable.getString("TID_TEAM_MEMBER_STATUS_" + i),
                -1,
                i,
                -1,
                EDebugCategory.CHANGE_STATUS,
                Configuration.preferredStatus == i
            );
        }

        /// #if DEBUG
        if (LogicVersion.isDeveloperBuild()) {
            this.createDebugMenuButton(`Toggle DEV Build Message`, -1, -1, -1, EDebugCategory.TESTS, -1, () => {
                UsefulInfo.disableDevBuildMessage = !UsefulInfo.disableDevBuildMessage;
            });

            this.createDebugMenuButton(`Spawn Test Popup`, -1, -1, -1, EDebugCategory.TESTS);
            this.createDebugMenuButton("Send StartSpectate myself", -1, -1, 0, EDebugCategory.BATTLE);
            this.createDebugMenuButton("DVD Test", -1, -1, 0, EDebugCategory.TESTS);

            if (GeneAssets.getAsset("CUSTOM_BG"))
                this.createDebugMenuButton(`Change background`, -1, -1, -1, EDebugCategory.TESTS, -1, () => {
                    HomeScreen.setTheme(GeneAssets.getAsset("CUSTOM_BG"));
                });
        }

        if (LogicVersion.isDeveloperBuild()) {
            this.createDebugMenuButton("Hamster", -1, -1, 0, EDebugCategory.TESTS, -1, () => {
                Debug.toggleDebugClickerButtonPressed();
            });

            this.createDebugMenuButton("Test Case", -1, -1, 0, EDebugCategory.TESTS, -1, () => {
                console.log("Init test case!");
                TestCase.doCase();
                console.log("Test case done!");
            });

            this.createDebugMenuButton("Test callback button", -1, -1, 0, EDebugCategory.TESTS, 0, (button: NativePointer, listener: NativePointer) => {
                console.log("Test callback button pressed!");

                GUI.showFloaterText("Test callback button works!");
            });

            this.createDebugMenuButton("Print Non-localized strings", -1, -1, 0, EDebugCategory.TESTS, 0, () => {
                console.log(LocalizationManager.unknownStrings.toString().split(",").map(key => `${key}: ""`).join(",\n"));
            });

            this.createDebugMenuButton("HTTP test", -1, -1, 0, EDebugCategory.EXPERIMENTAL, 0, () => {
                console.log("HTTP Test...");

                const httpClient = new NativeHTTPClient();
                httpClient.downloadFile("https://brawlstars.inbox.supercell.com/data/en/news/manifest.json", Path.getUpdatePath() + "manifest.json");
            });
        }
        /// #endif

        //let searchHelp = this.movieClip.getTextFieldByName("search_help");
        //searchHelp?.setText("type here to search");

        let searchHelp = this.movieClip.getTextFieldByName("search_help");
        searchHelp?.setText("t.me/gene_land");

        //searchHelp?.setTextColor(RGBA.purple)

        let clear = this.movieClip.getChildByName("clear_button");
        clear.getTextFieldByName("text")?.setText("clear");

        let categories: DebugMenuCategory[] = [];
        let buttons: GameButton[] = [];

        this.buttons.forEach(function (a: GameButton) {
            if (a instanceof DebugMenuCategory) {
                categories.push(a);
            } else {
                buttons.push(a);
            }
        });

        buttons.sort((a, b) => {
            let name = a.getText();
            let name2 = b.getText();

            if (name < name2) {
                return -1;
            }
            if (name > name2) {
                return 1;
            }

            return 0;
        });

        categories.sort((a, b) => {
            let name = a.name;
            let name2 = b.name;

            if (name < name2) {
                return -1;
            }
            if (name > name2) {
                return 1;
            }

            return 0;
        });

        this.buttons = buttons.concat(categories);

        this.shouldUpdateLayout = true;
    }

    private static isNotImplemented(name: string): boolean {
        return DebugMenu.notImplementedFunctions.includes(name);
    }

    private static isNotImplementedForIOS(name: string): boolean {
        return DebugMenu.notImplementedIOSFunctions.includes(name);
    }

    private static isNotImplementedForAndroid(name: string): boolean {
        return DebugMenu.notImplementedAndroidFunctions.includes(name);
    }

    private accountButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "BYPASS_OUT_OF_SYNC":
                button.switchCheckbox(Configuration.antiOutOfSync);
                Configuration.antiOutOfSync = !Configuration.antiOutOfSync;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("OUT_OF_SYNC", Configuration.antiOutOfSync)
                );
                break;
            case "Reveal Demon Mutation":
                const _command = new LogicRevealMutationCommand(0);

                HomeMode.addCommand(_command);
                break;
            case "Reveal Angel Mutation":
                const command = new LogicRevealMutationCommand(1);

                HomeMode.addCommand(command);
                break;
        }
    }

    private battleButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "BATTLE_SETTINGS":
                Debug.toggleSetAlphaButtonClicked();
                break;
            case "HIDE_ULTI_AIMING":
                button.switchCheckbox(!Configuration.showUlti);
                GUI.showFloaterText(LocalizationManager.getStateString("HIDE_ULTI_AIMING", Configuration.showUlti));

                Configuration.showUlti = !Configuration.showUlti;
                Configuration.save();
                break;
            case "HIDE_BATTLE_STATE":
                button.switchCheckbox(Configuration.hideBattleState);
                Configuration.hideBattleState = !Configuration.hideBattleState;
                Configuration.save();

                GUI.showFloaterText(LocalizationManager.getString(
                    Configuration.hideBattleState ? "BATTLE_STATE_HIDDEN" : "BATTLE_STATE_VISIBLE"
                ));
                break;
            case "PROTECTIVE_FEATURES":
                button.switchCheckbox(Configuration.enableProtective);
                Configuration.enableProtective = !Configuration.enableProtective;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("PROTECTIVE_FEATURES", Configuration.enableProtective)
                );
                break;
            case "AUTO_READY":
                button.switchCheckbox(Configuration.autoReady);
                GUI.showFloaterText(LocalizationManager.getStateString("AUTO_READY", !Configuration.autoReady));

                Configuration.autoReady = !Configuration.autoReady;
                Configuration.save();
                break;
            case "SPECTATE_BY_TAG":
                const specPopup = new SpectateByTagPopup();

                GUI.showPopup(specPopup.instance, 1, 0, 1);
                break;
            case "ANTI_AFK":
                button.switchCheckbox(Configuration.antiAFK);
                GUI.showFloaterText(LocalizationManager.getStateString("ANTI_AFK", !Configuration.antiAFK));

                Configuration.antiAFK = !Configuration.antiAFK;
                Configuration.save();
                break;
            case "SEND_EMPTY_EMOTE":
                if (!GameStateManager.isState(5)) {
                    break;
                }

                ClientInputManager.addInput(new ClientInput(ClientInputType.Emote));

                break;
            case "SKIP_BATTLE_END_REPLAY":
                button.switchCheckbox(Configuration.skipBattleEndReplay);
                Configuration.skipBattleEndReplay = !Configuration.skipBattleEndReplay;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SKIP_BATTLE_END_REPLAY", Configuration.skipBattleEndReplay)
                );
                break;
            case "SKIP_REPLAY_INTRO":
                button.switchCheckbox(Configuration.skipReplayIntro);
                GUI.showFloaterText(LocalizationManager.getStateString("SKIP_REPLAY_INTRO", !Configuration.skipReplayIntro));

                Configuration.skipReplayIntro = !Configuration.skipReplayIntro;
                Configuration.save();
                break;
            case "MOVEMENT_BASED_AUTOSHOOT":
                button.switchCheckbox(Configuration.movementBasedAutoshoot);
                GUI.showFloaterText(LocalizationManager.getStateString("MOVEMENT_BASED_AUTOSHOOT", !Configuration.movementBasedAutoshoot));

                Configuration.movementBasedAutoshoot = !Configuration.movementBasedAutoshoot;
                Configuration.save();
                break;
            case "Send StartSpectate myself":
                let message = new StartSpectateMessage(MessageManager.accountId, false);

                MessageManager.sendMessage(message);
                //  MessageManager.sendMessage(new StopSpectateMessage());
                break;
            case "MARK_FAKE_LEON":
                button.switchCheckbox(Configuration.markFakeNinja);
                GUI.showFloaterText(LocalizationManager.getStateString("MARK_FAKE_NINJA", !Configuration.markFakeNinja));

                Configuration.markFakeNinja = !Configuration.markFakeNinja;
                Configuration.save();
                break;
            case "SHOW_ENEMY_AMMO":
                button.switchCheckbox(Configuration.showEnemyAmmo);
                GUI.showFloaterText(
                    LocalizationManager.getStateString("ENEMY_BULLETS", !Configuration.showEnemyAmmo)
                );

                Configuration.showEnemyAmmo = !Configuration.showEnemyAmmo;
                Configuration.save();
                break;

            case "SHOW_CHAT_BUTTON":
                button.switchCheckbox(Configuration.showChatButton);

                GUI.showFloaterText(
                    LocalizationManager.getStateString("CHAT_BUTTON", !Configuration.showChatButton)
                );

                Configuration.showChatButton = !Configuration.showChatButton;
                Configuration.save();

                if (!BattleMode.getInstance().isNull() && TeamManager.shouldShowOpenChatButton()) {
                    Debug.getOpenChatButton().visibility = Configuration.showChatButton;
                }
                break;
            default:
                console.warn("DebugMenu.battleButtonPressed:", "no case for", text);
                break;
        }
    }

    private changeThemeButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        if (text == "CURRENT_SERVER_THEME") {
            Configuration.themeId = -1;
            Configuration.save();

            // TODO: check after fucking event ends.
            const themeData = LogicDataTables.getDataById(41, GlobalID.getInstanceID(Storage.serverThemeId)) as LogicThemeData;

            if (themeData.instance.isNull()) return;

            HomeScreen.replaceTheme(themeData, themeData);

            const category = this.getCategory(EDebugCategory.CHANGE_THEME)!;

            category.buttons.forEach(function (btn) {
                if (!btn.getCheckbox().isNull())
                    btn.switchCheckbox(btn.instance.add(454).readInt() != -1);
            });

            return;
        }
        const themeData = LogicDataTables.getThemeByName(text);

        if (themeData.instance.isNull()) return;
        if (Configuration.themeId == themeData.getGlobalID() || Configuration.themeMusicId == -1) {
            Configuration.themeMusicId = themeData.getGlobalID();
        } else {
            GUI.showFloaterText(LocalizationManager.getString("DOUBLE_CLICK_TO_SET_THEME_MUSIC"));
        }

        const musicData = new LogicThemeData(LogicDataTables.getByGlobalId(Configuration.themeMusicId));

        if (themeData.instance.isNull()) return;
        Configuration.themeId = themeData.getGlobalID();
        Configuration.save();
        HomeScreen.replaceTheme(themeData, musicData);
        const intParameter = button.instance.add(454).readInt();
        const category = this.getCategory(EDebugCategory.CHANGE_THEME)!;
        category.buttons.forEach(function (btn) {
            if (!btn.getCheckbox().isNull())
                btn.switchCheckbox(btn.instance.add(454).readInt() != intParameter);
        });
    }

    private changeStatusButtonPressed(gameButton: GameButton) {
        let text = gameButton.getOriginalName();

        const intParameter = gameButton.instance.add(454).readInt();

        let category = this.getCategory(EDebugCategory.CHANGE_STATUS)!;

        category.buttons.forEach(function (btn) {
            if (!btn.getCheckbox().isNull())
                btn.switchCheckbox(btn.instance.add(454).readInt() != intParameter);
        });

        if (intParameter != -1)
            GUI.showFloaterText(LocalizationManager.getString("STATUS_CHANGED").replace("%STATUS", text));
        else
            GUI.showFloaterText(LocalizationManager.getString("STATUS_REVERTED"));

        Configuration.preferredStatus = intParameter;
        Configuration.save();
    }

    private funButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "PROBING_CANE_MODE":
                button.switchCheckbox(Configuration.braille);
                Configuration.braille = !Configuration.braille;

                if (this.isBrailleSwitchBegan) {
                    this.isBrailleSwitchBegan = false;
                    clearTimeout(this.brailleTimeout);

                    GUI.showFloaterText(
                        LocalizationManager.getString("BRAILLE_INTERRUPTED")
                    );
                    break;
                }

                GUI.showFloaterText(LocalizationManager.getStateString("BRAILLE", Configuration.braille));

                this.isBrailleSwitchBegan = true;
                this.brailleTimeout = setTimeout(() => {
                    if (Configuration.braille) {
                        const currentLanguage = StringTable.getCurrentLanguageCode();

                        if (!Braille.isLanguageSupported(currentLanguage)) {
                            Settings.setSelectedLanguage("EN");
                        }
                    }

                    Debug.destruct();
                    GameMain.reloadGame();
                    Configuration.save();
                }, 4000);
                break;
            case "ADVANCED_PROBING_CANE_MODE":
                button.switchCheckbox(Configuration.braille_textfield);
                Configuration.braille_textfield = !Configuration.braille_textfield;
                TextField.patch();
                break;

            case "SPAWN_DVD":
                const dvd = new DVD();
                dvd.createOnStage();
                Storage.dvd.push(dvd);
                break;

            case "REMOVE_DVD":
                if (Storage.dvd.length === 0) return;
                const _dvd = Storage.dvd[Storage.dvd.length - 1];
                _dvd.destruct();
                Storage.dvd = Storage.dvd.filter(e => !e.instance.equals(_dvd.instance));
                break;

            case "REMOVE_ALL_DVD":
                for (const dvd of Storage.dvd) {
                    dvd.destruct();
                    Storage.dvd = Storage.dvd.filter(e => !e.instance.equals(dvd.instance));
                }
                break;
        }
    }

    private gfxButtonPressed(button: GameButton) {
        let text = button.getOriginalName();
        let gameButton = button;

        switch (text) {
            case "DARK_THEME":
                gameButton.switchCheckbox(Configuration.darkTheme);
                Configuration.darkTheme = !Configuration.darkTheme;
                Configuration.save();

                if (this.isDarkThemeSwitchBegan) {
                    this.isDarkThemeSwitchBegan = false;
                    clearTimeout(this.darkThemeTimeout);

                    GUI.showFloaterText(
                        LocalizationManager.getString("DARK_THEME_INTERRUPTED")
                    );
                    break;
                }

                GUI.showFloaterText(LocalizationManager.getStateString("DARK_THEME", Configuration.darkTheme));

                this.isDarkThemeSwitchBegan = true;
                this.darkThemeTimeout = setTimeout(() => {
                    Debug.destruct();
                    GameMain.reloadGame();
                    Configuration.save();
                }, 4000);
                break;
            case "SHOW_BOT_PREFIX":
                button.switchCheckbox(Configuration.showBotPrefix);

                Configuration.showBotPrefix = !Configuration.showBotPrefix;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("BOT_PREFIX", Configuration.showBotPrefix)
                );
                break;
            case "STATIC_BACKGROUND":
                gameButton.switchCheckbox(Configuration.staticBackground);
                Configuration.staticBackground = !Configuration.staticBackground;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("STATIC_BACKGROUND", Configuration.staticBackground)
                );
                break;
            case "SHOW_EDIT_CONTROLS":
                gameButton.switchCheckbox(Configuration.showEditControls);
                Configuration.showEditControls = !Configuration.showEditControls;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("EDIT_CONTROLS", Configuration.showEditControls)
                );
                break;
            case "SHOW_BATTLE_SHORTCUTS":
                gameButton.switchCheckbox(Configuration.showBattleShortcuts);
                Configuration.showBattleShortcuts = !Configuration.showBattleShortcuts;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("BATTLE_SHORTCUTS", Configuration.showBattleShortcuts)
                );
                break;
            case "HIDE_DEBUG_ITEMS":
                gameButton.switchCheckbox(Configuration.showDebugItems);
                Configuration.showDebugItems = !Configuration.showDebugItems;
                Configuration.save();

                if (!Configuration.showDebugItems)
                    Debug.hideDebugItems();

                GUI.showFloaterText(LocalizationManager.getString(
                    Configuration.showDebugItems ? "DEBUG_ITEMS_VISIBLE" : "DEBUG_ITEMS_HIDDEN"
                ));
                break;
            case "Hide/show connection indicator":
                gameButton.switchCheckbox(Configuration.showConnectionIndicator);
                Configuration.showConnectionIndicator = !Configuration.showConnectionIndicator;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("CONNECTION_INDICATOR", Configuration.showConnectionIndicator)
                );
                break;
            case "SLOW_MODE":
                gameButton.switchCheckbox(Configuration.slowMode);
                Configuration.slowMode = !Configuration.slowMode;
                Configuration.save();

                GameMain.setSlowMode(Configuration.slowMode);

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SLOW_MODE", Configuration.slowMode)
                );

                break;
            case "DISABLE_OUTLINE":
                gameButton.switchCheckbox(!Configuration.drawOutline);
                Configuration.drawOutline = !Configuration.drawOutline;

                GUI.showFloaterText(
                    LocalizationManager.getStateString("DISABLE_OUTLINE", !Configuration.drawOutline)
                );

                Configuration.save();
                break;
            case "VISUAL_CHROMATIC_NAME":
                gameButton.switchCheckbox(Configuration.fakePremiumPass);
                Configuration.fakePremiumPass = !Configuration.fakePremiumPass;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("FAKE_PREMIUM_PASS", Configuration.fakePremiumPass)
                );
                break;
            case "HIDE_SIDE_MASK":
                gameButton.switchCheckbox(!Configuration.showSidemask);
                Configuration.showSidemask = !Configuration.showSidemask;
                Configuration.save();

                GUI.showFloaterText(LocalizationManager.getStateString("SIDE_MASK", Configuration.showSidemask));
                break;
            case "FORCE_CHINA_GFX_TWEAKS":
                gameButton.switchCheckbox(Configuration.isChinaVersion);
                Configuration.isChinaVersion = !Configuration.isChinaVersion;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("CHINA_VERSION", Configuration.isChinaVersion)
                );
                break;
            case "HIDE_CREATOR_BOOST":
                gameButton.switchCheckbox(!Configuration.contentCreatorBoost);
                Configuration.contentCreatorBoost = !Configuration.contentCreatorBoost;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("CONTENT_CREATOR_BOOST", Configuration.contentCreatorBoost)
                );
                break;
            case "EMOTE_ANIMATION":
                gameButton.switchCheckbox(Configuration.emoteAnimation);
                Configuration.emoteAnimation = !Configuration.emoteAnimation;
                Configuration.save();

                if (Configuration.emoteAnimation)
                    LogicData.revertEmoteAnimationPatch();
                else
                    LogicData.patchEmoteAnimation();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("EMOTE_ANIMATION", Configuration.emoteAnimation)
                );
                break;
            case "SHOW_FUTURE_EVENTS":
                gameButton.switchCheckbox(Configuration.showFutureEvents);
                Configuration.showFutureEvents = !Configuration.showFutureEvents;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("FUTURE_EVENTS", Configuration.showFutureEvents)
                );
                break;
            case "SKIP_STARR_DROP_ANIMATION":
                gameButton.switchCheckbox(Configuration.skipRandomAnimation);
                Configuration.skipRandomAnimation = !Configuration.skipRandomAnimation;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SKIP_RANDOM_ANIMATION", Configuration.skipRandomAnimation)
                );
                break;
            case "HIDE_LOBBY_INFO":
                let visible = Debug.getLobbyInfo().visibility;

                gameButton.switchCheckbox(!visible);
                Debug.getLobbyInfo().showInfo(!visible);

                break;
            case "USE_LEGACY_BACKGROUND":
                gameButton.switchCheckbox(Configuration.useLegacyThemeMode);
                Configuration.useLegacyThemeMode = !Configuration.useLegacyThemeMode;
                Configuration.save();

                const themeMovieClip = HomeScreen.getThemeMovieClip();
                HomeScreen.setLegacyTheme(themeMovieClip, Configuration.useLegacyThemeMode);

                GUI.showFloaterText(
                    LocalizationManager.getStateString("LEGACY_BACKGROUND", Configuration.useLegacyThemeMode)
                );
                break;
            default:
                console.warn("DebugMenu.gfxButtonPressed:", "no case for", text);
                break;
        }
    }

    private gameSettingButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "SFX":
                GameSettings.sfxEnabled = (!GameSettings.sfxEnabled);
                button.switchCheckbox(!GameSettings.sfxEnabled);

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SFX", GameSettings.sfxEnabled)
                );
                break;
            case "MUSIC":
                GameSettings.musicEnabled = (!GameSettings.musicEnabled);
                button.switchCheckbox(!GameSettings.musicEnabled);

                GUI.showFloaterText(
                    LocalizationManager.getStateString("MUSIC", GameSettings.musicEnabled)
                );
                break;
            case "HAPTICS":
                GameSettings.hapticsEnabled = (!GameSettings.hapticsEnabled);
                button.switchCheckbox(!GameSettings.hapticsEnabled);

                GUI.showFloaterText(
                    LocalizationManager.getStateString("HAPTICS", GameSettings.hapticsEnabled)
                );
                break;
        }
    }

    private latencyButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        if (text.startsWith("#")) {
            let a = text.split(" ");
            let regionId = Number(a[0].substring(1));

            LatencyManager.changeRegion(regionId);

            return;
        }

        switch (text) {
            case "DISABLE_SPOOF":
                LatencyManager.disableSpoof();

                GUI.showFloaterText(LocalizationManager.getString("BATTLE_SERVER_SPOOF_DISABLED"));
                break;
        }
    }

    private optimizationButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "HIDE_SPECIAL_OFFERS":
                button.switchCheckbox(!Configuration.specialOffers);

                Configuration.specialOffers = !Configuration.specialOffers;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SPECIAL_OFFERS", !Configuration.specialOffers)
                );
                break;
            case "HIDE_BRAWLERS_IN_INTRO":
                button.switchCheckbox(Configuration.hideHeroesIntro);
                Configuration.hideHeroesIntro = !Configuration.hideHeroesIntro;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("HIDE_HEROES_INTRO", Configuration.hideHeroesIntro)
                );
                break;
            case "HIDE_LEAGUE_IN_BATTLE_CARD":
                button.switchCheckbox(Configuration.hideLeagueBattleCard);
                Configuration.hideLeagueBattleCard = !Configuration.hideLeagueBattleCard;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("HIDE_LEAGUE_BATTLE_CARD", Configuration.hideLeagueBattleCard)
                );
                break;
            case "USE_OLD_INTRO":
                button.switchCheckbox(Configuration.useOldIntro);
                Configuration.useOldIntro = !Configuration.useOldIntro;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("USE_OLD_INTRO", Configuration.useOldIntro)
                );

                LogicDataTables.patchClientGlobals();
                break;

            case "CHARACTER_SOUNDS":
                button.switchCheckbox(!Configuration.heroSounds);
                Configuration.heroSounds = !Configuration.heroSounds;
                Configuration.save();

                GameMain.reloadGame();
                break;
        }
    }

    private previewButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "DEBUG_OPEN_URL":
                const urlPopup = new OpenUrlPopup();

                GUI.showPopup(urlPopup.instance, 1, 0, 1);
                break;
            case "DEBUG_INFO":
                const debugInfo = Debug.createDebugInfo();
                debugInfo.addLine(MessageManager.accountInfo);
                GameMain.getGameSprite().addChild(debugInfo);

                this.hide();

                break;
        }
    }

    private proxyButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "NO_PROXY":
                Configuration.useProxy = false;
                Configuration.save();

                GUI.showFloaterText(LocalizationManager.getString(
                    "PROXY_DISABLED"
                ));
                break;
            case "Gene Proxy":
                Configuration.useProxy = true;
                Configuration.save();


                GUI.showFloaterText(LocalizationManager.getString(
                    "GENE_PROXY"
                ));
                break;
        }
    }

    private serverButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "SWITCH_TO_STAGE_SERVER":
                Configuration.useStage = true;
                Configuration.save();

                GameMain.reloadGame();
                break;
            case "SWITCH_TO_PROD_SERVER":
                Configuration.useStage = false;
                Configuration.save();

                GameMain.reloadGame();
                break;
        }
    }

    private streamerModeButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "HIDE_TAGS":
                button.switchCheckbox(!Configuration.showTags);
                Configuration.showTags = !Configuration.showTags;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_TAGS", Configuration.showTags)
                );
                break;
            case "HIDE_NAME":
                button.switchCheckbox(!Configuration.showName);
                Configuration.showName = !Configuration.showName;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_NAME", Configuration.showName)
                );
                break;
        }
    }

    private testButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "Spawn Test Popup":
                Debug.toggleUserImagesButtonPressed();
                break;
            case "DVD Test": // be quiet about this
                // Nothing ever happened here.
                break;

        }
    }

    private miscButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "BYPASS_ANTI_PROFANITY":
                if (!Configuration.antiProfanity) {
                    this.summonDebugDangerousPopup(button, this.switchBypassAntiProfanityFunction);
                    return;
                }

                this.switchBypassAntiProfanityFunction(button);
                break;
            case "CLOSE_RANKED_SCREEN":
                HomeScreen.terminateRankedMatch();
                break;
            case "PROFILE_BY_TAG":
                const profPopup = new ProfileByTagPopup();

                GUI.showPopup(profPopup.instance, 1, 0, 1);
                break;
        }
    }

    private usefulInfoButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        switch (text) {
            case "SHOW_FPS":
                button.switchCheckbox(Configuration.showFPS);
                Configuration.showFPS = !Configuration.showFPS;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_FPS", Configuration.showFPS)
                );
                break;
            case "SHOW_TIME":
                button.switchCheckbox(Configuration.showCurrentTime);
                Configuration.showCurrentTime = !Configuration.showCurrentTime;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_CURRENT_TIME", Configuration.showCurrentTime)
                );
                break;
            case "SHOW_SESSION_TIME":
                button.switchCheckbox(Configuration.showSessionTime);
                Configuration.showSessionTime = !Configuration.showSessionTime;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_SESSION_TIME", Configuration.showSessionTime)
                );
                break;
            case "SHOW_OWN_TEAM":
                button.switchCheckbox(Configuration.showTeam);
                Configuration.showTeam = !Configuration.showTeam;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_TEAM", Configuration.showTeam)
                );
                break;
            case "SHOW_BATTLE_INFO":
                button.switchCheckbox(Configuration.showBattleInfo);

                Configuration.showBattleInfo = !Configuration.showBattleInfo;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("BATTLE_INFO", Configuration.showBattleInfo)
                );
                break;
            case "Show svo button":
                button.switchCheckbox(Configuration.showSVOButton);

                Configuration.showSVOButton = !Configuration.showSVOButton;
                Configuration.save();

                Debug.getSVOButton().visibility = Configuration.showSVOButton;
                break;
            case "SHOW_BATTLE_PING":
                button.switchCheckbox(Configuration.showBattlePing);

                Configuration.showBattlePing = !Configuration.showBattlePing;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("BATTLE_PING", Configuration.showBattlePing)
                );
                break;
            case "SHOW_TICKS":
                button.switchCheckbox(Configuration.showTicks);

                Configuration.showTicks = !Configuration.showTicks;
                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getStateString("SHOW_TICKS", Configuration.showTicks)
                );
                break;
            case "CHANGELOGS":
                NativeDialog.showNativeDialog(
                    NULL,
                    LocalizationManager.getString("CHANGELOGS_DIALOG_TITLE"),
                    LocalizationManager.changelogs,
                    LocalizationManager.getString("CHANGELOGS_DIALOG_BUTTON")
                );
                break;
        }
    }

    private xrayButtonPressed(button: GameButton) {
        let text = button.getOriginalName();

        // text - playerName

        if (text == "Disable X-Ray") {
            GUI.showFloaterText(
                LocalizationManager.getString("XRAY_OFF")
            );

            BattleMode.xrayTargetGlobalId = -1;
            BattleMode.xrayTargetPlayerIndex = -1;

            return;
        }

        BattleMode.setXrayTarget(text);
    }

    isButtonAvailable(name: string): boolean {
        if (DebugMenu.isNotImplemented(name)) {
            if (LogicVersion.isDeveloperBuild()) {
                console.warn("DebugMenu.isButtonAvailable", name, "is not implemented!");
                return true;
            }

            GUI.showFloaterText(LocalizationManager.getString("NOT_IMPLEMENTED_YET"));
            return false;
        }

        if (LogicDefines.isPlatformAndroid() && DebugMenu.isNotImplementedForAndroid(name)) {
            if (LogicVersion.isDeveloperBuild()) {
                console.warn("DebugMenu.isButtonAvailable", name, "is not implemented for Android!");
            }

            GUI.showFloaterText(LocalizationManager.getString("NOT_IMPLEMENTED_YET_ANDROID"));
            return false;
        }

        if (LogicDefines.isPlatformIOS() && DebugMenu.isNotImplementedForIOS(name)) {
            if (LogicVersion.isDeveloperBuild()) {
                console.warn("DebugMenu.isButtonAvailable", name, "is not implemented for iOS!");
            }

            GUI.showFloaterText(LocalizationManager.getString("NOT_IMPLEMENTED_YET_IOS"));
            return false;
        }

        return true;
    }

    buttonPressed(listener: NativePointer, button: NativePointer): void {
        let debugMenu = Debug.getDebugMenu();

        let gameButton = new GameButton(button);
        let name = gameButton.getOriginalName();

        if (!debugMenu.isButtonAvailable(name)) {
            return;
        }

        let category = button.add(498).readPointer().fromsc();

        console.log("DebugMenu::buttonPressed:", gameButton.getTextString(), "(category:", category + ")");

        switch (category) {
            case "ACCOUNT":
                debugMenu.accountButtonPressed(gameButton);
                break;
            case "BATTLE":
                debugMenu.battleButtonPressed(gameButton);
                break;
            case "CAMERA_MODE":
                debugMenu.cameraModeButtonPressed(gameButton);
                break;
            case "CHANGE_THEME":
                debugMenu.changeThemeButtonPressed(gameButton);
                break;
            case "CHANGE_STATUS":
                debugMenu.changeStatusButtonPressed(gameButton);
                break;
            case "FUN":
                debugMenu.funButtonPressed(gameButton);
                break;
            case "GFX":
            case "PRC_CHINA":
                debugMenu.gfxButtonPressed(gameButton);
                break;
            case "GAME_SETTINGS":
                debugMenu.gameSettingButtonPressed(gameButton);
                break;
            case "LATENCY":
                debugMenu.latencyButtonPressed(gameButton);
                break;
            case "OPTIMIZATION":
                debugMenu.optimizationButtonPressed(gameButton);
                break;
            case "PREVIEW":
                debugMenu.previewButtonPressed(gameButton);
                break;
            case "PROXY":
                debugMenu.proxyButtonPressed(gameButton);
                break;
            case "SERVERS":
                debugMenu.serverButtonPressed(gameButton);
                break;
            case "STREAMER_MODE":
                debugMenu.streamerModeButtonPressed(gameButton);
                break;
            case "TESTS":
                debugMenu.testButtonPressed(gameButton);
                break;
            case "USEFUL_INFO":
                debugMenu.usefulInfoButtonPressed(gameButton);
                break;
            case "XRAY":
                debugMenu.xrayButtonPressed(gameButton);
                break;
            case "MISC":
                debugMenu.miscButtonPressed(gameButton);
                break;
            default:
                console.warn("DebugMenu.buttonPressed:", "no case for", category);
                break;
        }

        switch (name) {
            case "RESTART_GAME":
                Debug.destruct();
                GameMain.reloadGame();
                break;
        }
    }

    createDebugMenuButton(name: string, actionIdx: number = -1, intParameter: number = -1, btnType: number = 0, category?: EDebugCategory, state: number | boolean = -1, callback?: Function, translate = true) {
        let movieClip = ResourceManager.getMovieClip(Resources.DEBUG, "debug_menu_item");
        let checkBox: MovieClip | null = null;
        let localizedName = translate ? LocalizationManager.getString(name) : name;

        if (state != -1) {
            try {
                if (GeneAssets.wasLoaded(Resources.GENE_DEBUG)) {
                    let anotherMovieClip = ResourceManager.getMovieClip(Resources.GENE_DEBUG, "debug_menu_checkbox");

                    checkBox = anotherMovieClip.getChildById(2);
                    checkBox.instance.add(Process.pointerSize).writeU8(Number(state));
                    movieClip.addChild(checkBox);
                }
                else {
                    console.warn("DebugMenu.spawnDebugMenuButton:", "Resources.GENE_DEBUG wasn't loaded!");
                }
            } catch (e) {
                console.error("GENE_DEBUG not loaded!");
            }
        }

        let categoryName = category ? EDebugCategory[category] : "";

        if (actionIdx != -1) {
            let debugCmdButton = new DebugCommandButton(actionIdx, intParameter, btnType);
            debugCmdButton.setMovieClip(movieClip);
            debugCmdButton.instance.add(498).writePointer(categoryName ? categoryName.scptr() : "".scptr());

            /// #if DEBUG
            if (LogicVersion.isDeveloperBuild()) {
                localizedName += ` (<c3>action</c>=${actionIdx} <c5>intP</c>=${intParameter})`;
            }
            /// #endif

            debugCmdButton.setOriginalName(name);
            debugCmdButton.setText(localizedName);

            this.addButton(debugCmdButton, category);
        }

        else {
            let button = new GameButton();
            button.setMovieClip(movieClip);

            let formattedName = localizedName;

            if (DebugMenu.dangerousFunctions.includes(name)) {
                formattedName = `<cff0000>${localizedName}</c>`;
            }

            button.setText(formattedName);
            button.instance.add(454).writeInt(intParameter);

            button.instance.add(490).writePointer(localizedName.scptr());

            button.instance.add(498).writePointer(categoryName ? categoryName.scptr() : "".scptr());

            if (checkBox) {
                button.setCheckbox(checkBox.instance);
            }

            button.setOriginalName(name);

            this.addButton(button, category);

            if (callback && this.isButtonAvailable(localizedName)) {
                button.setButtonListener(new IButtonListener(callback));
            }
        }
    }

    private cameraModeButtonPressed(gameButton: GameButton) {
        let text = gameButton.getOriginalName();

        switch (text) {
            case "3D":
            case "NEXT_CAMERA_MODE":
                Configuration.battleCammeraMode++;
                if (Configuration.battleCammeraMode > 3)
                    Configuration.battleCammeraMode = 0;

                Configuration.save();

                GUI.showFloaterText(
                    LocalizationManager.getString("CAMERA_MODE_CHANGED").replace(
                        "{cameraMode}",
                        LocalizationManager.getString("CAMERA_MODE_" + Configuration.battleCammeraMode)
                    )
                );

                break;
        }
    }

    private switchBypassAntiProfanityFunction(button: GameButton) {
        Configuration.antiProfanity = !Configuration.antiProfanity;
        Configuration.save();
        button.switchCheckbox(!Configuration.antiProfanity);
        GUI.showFloaterText(
            LocalizationManager.getStateString("ANTI_PROFANITY", Configuration.antiProfanity)
        );
    }

    private summonDebugDangerousPopup(button: GameButton, executeFunction: Function) {
        const dangerous = new DebugDangerousFunctionPopup(button.getText().removeColorCodes());

        dangerous.addYesButton(() => {
            executeFunction(button);
        });

        GUI.showPopup(dangerous.instance, 1, 0, 1);
    }
}
