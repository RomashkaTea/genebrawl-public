import {Change} from "./changelogs/Change";
import {ChangeLog} from "./changelogs/ChangeLog";

interface Locale {
    [key: string]: string;
}

export class LocalizationManager {
    static localization: Locale;
    static changelogs: string;
    static unknownStrings: Array<string> = [];

    static defaultLanguage = "EN";
    static selectedLanguage = "EN";

    static loadLocalization(localizationName: string) {
        if (!Object.prototype.hasOwnProperty.call(LocalizationManager.locales, localizationName)) {
            LocalizationManager.selectedLanguage = LocalizationManager.defaultLanguage;
            LocalizationManager.localization = LocalizationManager.locales[LocalizationManager.defaultLanguage];
            console.log("LocalizationManager.loadLocalization:", localizationName, "is unknown. Selecting default one:", LocalizationManager.defaultLanguage);
            return;
        }

        LocalizationManager.selectedLanguage = localizationName;
        LocalizationManager.localization = Object.prototype.hasOwnProperty.call(LocalizationManager.locales, localizationName) ? LocalizationManager.locales[localizationName] : LocalizationManager.locales[LocalizationManager.defaultLanguage];
    }

    static getString(str: string) {
        if (LocalizationManager.localization[str]) {
            return LocalizationManager.localization[str];
        }

        if (LocalizationManager.localization[LocalizationManager.defaultLanguage]) {
            console.log("LocalizationManager.getString:", str, "doesn't exist in", LocalizationManager.selectedLanguage, "localization. Selecting from default one:", LocalizationManager.defaultLanguage);
            return LocalizationManager.localization[LocalizationManager.defaultLanguage];
        }

        //console.log("LocalizationManager.getString:", str, "is unknown.");

        LocalizationManager.unknownStrings.push(str);

        return str;
    }

    /**
     * LocalizationManager.getStateString("EXAMPLE", true) // EXAMPLE_ON -> Example is ON!
     *
     * я просто эту хуйню решил попроще сделать, так сказать чтобы повсюду не сувать тернарки, а просто вот так вызывать и заебись чо
     */
    static getStateString(str: string, state: boolean) {
        str += state ? "_ON" : "_OFF";
        return LocalizationManager.getString(str);
    }

    static buildChangelogs() {
        const changelogs: { [key: string]: ChangeLog[]; } = { // блять прошу меняйте их сука
            RU: [
                new ChangeLog("2024.12.03", 63, "Вероятней всего, последнее обновление скрипта на 58.279", {
                    additions: [
                        new Change("Настройки в бою!", "Battle -> Battle Settings"),
                        new Change("Кнопка чата в бою!", "Она показывается автоматически, если вы в команде и в бою.")
                    ],
                    fixes: [
                        new Change("Андердог теперь показывается в интро"),
                        new Change("Исправлен DVD.")
                    ]
                }),
                new ChangeLog("2024.11.18", 60, "", {
                    additions: [
                        new Change("Просмотр профиля по тэгу", "Account -> Profile by tag"),
                        new Change("Список изменений", "Useful Info -> Changelogs"),
                        new Change("Смена камеры в бою", "Camera Mode -> Next camera mode"),
                        new Change("Отображение пинга в бою", "Useful Info -> Show battle ping"),
                        new Change("Возможность отрубить новое интро", "Optimization -> Use old intro"),
                        new Change("Коляска-трость")
                    ],
                    fixes: [
                        new Change("Вернули показ патронов у противника", "Battle -> Show Enemy Ammo"),
                        new Change("Исправили отображение FPS")
                    ]
                })
            ],
            EN: [
                new ChangeLog("2024.12.03", 63, "Most likely the latest script update at 58.279", {
                    additions: [
                        new Change("Battle Settings!", "Battle -> Battle Settings"),
                        new Change("Chat button in battle!", "It shows up automatically if you are in a team and in battle.")
                    ],
                    fixes: [
                        new Change("Underdog is now displayed in intro"),
                        new Change("DVD fixed.")
                    ]
                }),
                new ChangeLog("2024.11.18", 60, "", {
                    additions: [
                        new Change("Checking profile by tag", "Account -> Profile by tag"),
                        new Change("Changelogs", "Useful Info -> Changelogs"),
                        new Change("Changing camera mode in battle", "Camera Mode -> Next camera mode"),
                        new Change("Showing battle ping", "Useful Info -> Show battle ping"),
                        new Change("Disable new intro", "Optimization -> Use old intro"),
                        new Change("Wheelchair-cane")
                    ],
                    fixes: [
                        new Change("Returned showing enemy's ammo", "Battle -> Show Enemy Ammo"),
                        new Change("Fixed FPS display")
                    ]
                })
            ]
        };

        this.changelogs = changelogs[this.selectedLanguage].map(log => log.build()).join("\n");
    }

    static getLocalizationKey(localed: string) {
        console.log(LocalizationManager.locales[this.selectedLanguage]["BATTLE"], localed);
        return Object.keys(LocalizationManager.locales[this.selectedLanguage]).find(e => LocalizationManager.locales[this.selectedLanguage][e] === localed);
    }

    static locales: { [key: string]: Locale; } = {
        RU: {
            RESTART_GAME: "Перезапустить игру",
            ADD_RESOURCES: "Добавить ресурсы",
            ADD_GEMS: "Добавить кристаллы",
            BYPASS_OUT_OF_SYNC: "Обход потери соединения",
            REMOVE_ALL_COINS: "Обнулить монеты",
            REMOVE_ALL_GEMS: "Обнулить кристаллы",
            UNLOCK_ALL_LVL7: "Разблокировать всё до уровня 7",
            UNLOCK_ALL_LVL9: "Разблокировать всё до уровня 9",
            UNLOCK_GADGETS: "Разблокировать гаджеты",
            UNLOCK_STAR_POWERS: "Разблокировать звездные силы",
            UNLOCK_ONE: "Разблокировать одного",
            UNLOCK_MAX_ONE: "Разблокировать и улучшить одного",
            UNLOCK_ALL: "Разблокировать всех",
            UNLOCK_MAX_ALL: "Разблокировать и улучшить всех",
            UNLOCK_MAX_ALL_NO_STAR_POWERS: "Разблокировать и улучшить всех без звездных сил",
            UNLOCK_EVENT_SLOTS: "Разблокировать события",
            REMOVE_HERO_SKINS: "Удалить скины бравлерам",
            ADD_POWER: "Добавить силу",
            ADD_SCORE: "Добавить кубки",
            DECREASE_SCORE: "Уменьшить кубки",
            CLAIM_35_MILESTONES: "Получить 35 этапов",
            ADD_1_WINSTREAK: "Добавить 1 серию побед",
            ADD_10_WINSTREAK: "Добавить 10 серий побед",
            ADD_100_WINSTREAK: "Добавить 100 серий побед",
            REMOVE_WINSTREAK: "Удалить серию побед",
            ADD_1000_BLINGS: "Добавить 1000 блингов",
            PROFILE_BY_TAG: "Открыть профиль по тегу",
            NEXT_CAMERA_MODE: "Изменить режим камеры",
            STATUS_NORMAL: "<c00ff00>ОБЫЧНЫЙ</c>",
            CURRENT_SERVER_THEME: "Текущая тема с сервера",
            NO_PROXY: "Отключить прокси",
            SFX: "Звук",
            MUSIC: "Музыка",
            HAPTICS: "Вибрация",
            SHOW_FPS: "Показывать FPS",
            SHOW_TIME: "Показывать время",
            SHOW_SESSION_TIME: "Показывать время в игре",
            SHOW_OWN_TEAM: "Показывать свою команду",
            SHOW_BATTLE_INFO: "Показывать информацию о матче",
            SHOW_BATTLE_PING: "Показывать пинг в бою",
            CHANGELOGS: "Список изменений",
            MOVEMENT_BASED_AUTOSHOOT: "Автоатака по направлению ходьбы",
            SPECTATE_BY_TAG: "Наблюдение по тегу",
            AUTO_DODGE: "Автоманс",
            HIDE_BATTLE_STATE: "Скрыть статус \"В бою\"",
            AUTO_EXIT_AFTER_BATTLE: "Авто-выход после боя",
            MARK_FAKE_LEON: "Помечать клона Леона",
            HIDE_ULTI_AIMING: "Скрыть прицеливание супером",
            STATIC_BACKGROUND: "Статичный фон меню",
            AUTO_AIM: "Автоматическая атака",
            DISABLE_SPOOF: "Отключить смену сервера",
            DEBUG_INFO: "Debug Info",
            DEBUG_OPEN_URL: "Открыть URL",
            OPEN_ACCOUNT_SWITCHER: "Открыть переключатель аккаунтов",
            HIDE_SIDE_MASK: "Спрятать рамки по бокам",
            DARK_THEME: "Тёмная тема",
            AUTO_ULTI: "Автоматический супер",
            AUTO_HYPERCHARGE: "Автоматический гиперзаряд",
            HOLD_TO_SHOOT: "Атака при удерживании кнопки",
            AUTO_MOVE_TO_TARGET: "Автоматически двигаться к цели",
            FOLLOW_CLOSEST_TEAMMATE: "Автоматически двигаться к союзнику",
            AUTO_PLAY_AGAIN: "Автоматически играть снова",
            SEND_EMPTY_EMOTE: "Отправить пустой эмодзи",
            SKIP_REPLAY_INTRO: "Пропускать интро в повторе",
            SKIP_BATTLE_END_REPLAY: "Пропускать \"Лучший Момент\"",
            AUTO_READY: "Автоматически \"ГОТОВО\"",
            BATTLE_SETTINGS: "Настройки камеры",
            SHOW_CHAT_BUTTON: "Показывать кнопку чата",
            SHOW_ENEMY_AMMO: "Показывать патроны соперников",
            ADD_BRAWL_PASS_POINTS_THIS_SEASON: "Добавить опыт Brawl Pass",
            ADD_CHAMPIONSHIP_CHALLENGE_WIN: "Добавить победу в Испытании Чемпионата",
            ADD_CHAMPIONSHIP_CHALLENGE_LOSS: "Добавить поражение в Испытании Чемпионата",
            SET_CC_ESPORTS_QUALIFIED: "Добавить кнопку \"ESPORTS\"",
            REMOVE_CC_ESPORTS_QUALIFIED: "Убрать кнопку \"ESPORTS\"",
            FORCE_CHINA_GFX_TWEAKS: "Включить китайские дополнения графики",
            HIDE_DEBUG_ITEMS: "Спрятать элементы дебага",
            HIDE_TAGS: "Спрятать теги",
            HIDE_NAME: "Спрятать имена",
            START_ROOM_SPAM: "Начать спам в руме",
            STOP_ROOM_SPAM: "Остановить спам в руме",
            SWITCH_TO_STAGE_SERVER: "Переключиться на Stage сервер",
            SWITCH_TO_PROD_SERVER: "Переключиться на Production сервер",
            UNLOCK_GEARS: "Разблокировать снаряжения",
            UNLOCK_CURRENT_BRAWL_PASS_SEASON: "Разблокировать Brawl Pass",
            UNLOCK_CURRENT_BRAWL_PASS_PLUS_SEASON: "Разблокировать Brawl Pass+",
            SKIN_CHANGER: "СКИН ЧЕНДЖЕР",
            ONLINE_SKIN_CHANGER: "Онлайн режим",
            DOUBLE_CLICK_TO_SET_THEME_MUSIC: "Нажми ещё раз, чтобы сменить музыку!",
            ANTI_AFK: "Анти AFK",
            HIDE_SPECIAL_OFFERS: "Спрятать особые акции",
            CHARACTER_SOUNDS: "Звуки бравлеров",
            HIDE_BRAWLERS_IN_INTRO: "Спрятать бравлеров в интро",
            HIDE_LEAGUE_IN_BATTLE_CARD: "Спрятать лигу боевой карты в интро",
            USE_OLD_INTRO: "Использовать старое интро",
            BYPASS_ANTI_PROFANITY: "Обход антицензуры",
            CLOSE_RANKED_SCREEN: "Закрыть ранговый матч",
            SLOW_MODE: "Медленный режим",
            VISUAL_CHROMATIC_NAME: "Хроматическое имя",
            DISABLE_OUTLINE: "Убрать обводку",
            EMOTE_ANIMATION: "Анимация эмодзи",
            SHOW_FUTURE_EVENTS: "Показывать будущие события",
            HIDE_CREATOR_BOOST: "Спрятать поддержку автора контента",
            SHOW_BOT_PREFIX: "Показывать префикс у ботов",
            USE_LEGACY_BACKGROUND: "Использовать оптимизированный фон",
            SKIP_STARR_DROP_ANIMATION: "Пропускать нажатия у Старр Дропов",
            PROBING_CANE_MODE: "Режим для слепых",
            ADVANCED_PROBING_CANE_MODE: "Продвинутый режим для слепых",
            SPAWN_DVD: "Добавить 1 DVD",
            REMOVE_DVD: "Удалить 1 DVD",
            REMOVE_ALL_DVD: "Удалить все DVD",
            KIT_MOVE_HACK: "Ходьба за Кита во время супера",
            HIDE_LOBBY_INFO: "Спрятать Lobby Info",

            TEST: "Тест!",
            AGE_GATE_REMOVAL_STARTED: "Открыт диалог с выбором возраста. Пожалуйста, выберите возраст 21 или выше чтобы снять ограничения.",

            HIDE_ULTI_AIMING_ON: "Теперь никто не увидит, что вы прицеливаетесь ультой!",
            HIDE_ULTI_AIMING_OFF: "Теперь все увидят, что вы прицеливаетесь ультой!",

            KIT_MOVE_HACK_ON: "Теперь Кит может передвигаться, сидя на другом бравлере.",
            KIT_MOVE_HACK_OFF: "Теперь Кит НЕ может передвигаться, сидя на другом бравлере.",

            EDIT_CONTROLS_ON: "Кнопка смены управления теперь <c41fc03>будет</c> отображаться в бою.",
            EDIT_CONTROLS_OFF: "Кнопка смены управления теперь <cfff700>не будет</c> отображаться в бою.",

            BATTLE_SHORTCUTS_ON: "Кнопки быстрого доступа теперь <c41fc03>будут</c> показаны в бою.",
            BATTLE_SHORTCUTS_OFF: "Кнопки быстрого доступа теперь <cfff700>не будут</c> показаны в бою.",

            SHOW_EDIT_CONTROLS: "Показать кнопку смены управления",
            SHOW_BATTLE_SHORTCUTS: "Показать кнопки быстрого доступа",

            AUTO_READY_ON: "Теперь при выходе в меню \"ГОТОВО\" будет нажиматься автоматически. (Только в команде)",
            AUTO_READY_OFF: "Теперь при выходе в меню \"ГОТОВО\" НЕ будет нажиматься автоматически.",

            AUTO_HYPERCHARGE_ON: "Теперь гиперзаряд будет активироваться автоматически.",
            AUTO_HYPERCHARGE_OFF: "Теперь гиперзаряд не будет активироваться автоматически.",

            AUTO_PLAY_AGAIN_ON: "Теперь кнопка \"Играть снова\" будет нажиматься автоматически после окончания боя!",
            AUTO_PLAY_AGAIN_OFF: "Теперь кнопка \"Играть снова\" больше не будет нажиматься автоматически!",

            AUTO_EXIT_AFTER_BATTLE_ON: "Теперь кнопка \"Выйти\" будет нажиматься автоматически после окончания боя!",
            AUTO_EXIT_AFTER_BATTLE_OFF: "Теперь кнопка \"Выйти\" больше не нажиматься автоматически после окончания боя!",

            SKIP_REPLAY_INTRO_ON: "Теперь лучший момент игры будет пропускаться!",
            SKIP_REPLAY_INTRO_OFF: "Теперь лучший момент игры не будет пропускаться!.",

            ANTI_AFK_ON: "Анти AFK включен!",
            ANTI_AFK_OFF: "Анти AFK выключен!",

            PROTECTIVE_FEATURES: "Защитные фичи",
            PROTECTIVE_FEATURES_ON: "Защитные фичи включены! <cff0900>Внимание!</c> Функция еще в разработке и может быть нестабильна",
            PROTECTIVE_FEATURES_OFF: "Защитные фичи отключены.",

            ANTI_PROFANITY_ON: "Обход запрета матов включён! Будьте осторожны, вас могут заблокировать за использование нецензурных слов!",
            ANTI_PROFANITY_OFF: "Обход запрета матов отключён.",

            PROXY_ERROR: "По всей видимости, прокси не работает.",
            PROD_SERVER_UPDATED: "Требуется обновление клиента! Для того, чтобы продолжить использовать Gene Brawl зайдите сюда - t.me/gene_land.",
            STAGE_SERVER_UPDATED: "Stage-сервер был обновлен до новой версии! Обновление клиента скачать нельзя :(",
            STAGE_SERVER_REQUIRES_VPN: "Stage-сервер недоступен с вашего местоположения.",

            LATENCY_TESTS_TRIGGERED: "Начинаем смену батл сервера, подождите..",
            BATTLE_SERVER_CHANGED: "Батл сервер изменен!",
            BATTLE_SERVER_SPOOF_DISABLED: "Смена батл сервера отключена!",

            NEED_TO_ACTIVATE: "Привет. Тебе нужно выполнить привязку! Введи (/activate $KEY) в ветку \"SCUtils\".",
            KEY_UNAVAILABLE: "Привет. По всей видимости, сервер активации сейчас не работает. Попробуй зайти позже!",

            TEAM_SPAM_INIT: "Спам начинается!",
            TEAM_SPAM_STOPPED: "Спам остановлен!",
            TEAM_SPAM_CANCELLED: "Спам отменен.",
            TEAM_SPAM_NOT_RUNNING: "Спам не был запущен",

            OUT_OF_SYNC_ON: "Теперь вас не будет кикать при выборе чего-то что у вас нет",
            OUT_OF_SYNC_OFF: "Теперь вас БУДЕТ кикать при выборе чего-то что у вас нет",

            CONTENT_CREATOR_BOOST_ON: "Поддержка автора контента включена.",
            CONTENT_CREATOR_BOOST_OFF: "Поддержка автора контента выключена.",

            BATTLE_STATE_HIDDEN: "Статус \"Бой\" теперь скрыт",
            BATTLE_STATE_VISIBLE: "Статус \"Бой\" больше не скрывается",

            SLOW_MODE_ON: "Режим Слоу-Мо включен",
            SLOW_MODE_OFF: "Режим Слоу-Мо выключен",

            SIDE_MASK_ON: "Показ рамок по бокам включен",
            SIDE_MASK_OFF: "Показ рамок по бокам выключен",

            FAKE_PREMIUM_PASS_ON: "Визуальный хроматический ник включен!",
            FAKE_PREMIUM_PASS_OFF: "Визуальный хроматический ник выключен!",

            FUTURE_EVENTS_ON: "Показ будущих событий включен!",
            FUTURE_EVENTS_OFF: "Показ будущих событий выключен!",

            DEBUG_ITEMS_HIDDEN: "Debug скрыт. Чтобы его вернуть, введите /debug в чат.",
            DEBUG_ITEMS_VISIBLE: "Debug вещи теперь показываются.",

            EMOTE_ANIMATION_ON: "Анимация эмодзей включена!",
            EMOTE_ANIMATION_OFF: "Анимация эмодзей выключена!",

            NO_COMMAND_DEFINED: "Такой команды нет!",

            PROXY_DISABLED: "Прокси отключено! При следующем заходе в игру, прокси не будет использоваться",
            GENE_PROXY: "Прокси включено! При следующем заходе в игру, будет использоваться Gene Proxy!",

            STATIC_BACKGROUND_ON: "Теперь в некоторых игровых меню будет использоваться фон из главного меню!",
            STATIC_BACKGROUND_OFF: "Теперь в некоторых игровых меню будет использоваться обычный фон!",

            CONNECTION_INDICATOR_ON: "Теперь в бою будет отображаться ваше подключение к серверу!",
            CONNECTION_INDICATOR_OFF: "Теперь в бою не будет отображаться ваше подключение к серверу!",

            DEFAULT_THEME_ON: "Теперь в главном меню будет использоваться обычный фон!", // потом надо будет смену фонов нормальную забабахать но сейчас этим ограничиваемся
            DEFAULT_THEME_OFF: "Теперь в главном меню будет использоваться тематический фон!",

            SPECIAL_OFFERS_ON: "Особые акции скрыты!",
            SPECIAL_OFFERS_OFF: "Особые акции отображены!",

            CHINA_VERSION_ON: "Теперь клиент игры использует китайские дополнения.",
            CHINA_VERSION_OFF: "Теперь клиент игры не использует китайские дополнения.",

            AUTO_MOVE_TARGET_ON: "Теперь ваш персонаж будет автоматически двигаться к ближайшему врагу.",
            AUTO_MOVE_TARGET_OFF: "Теперь ваш персонаж не будет автоматически двигаться к ближайшему врагу.",

            AUTO_AIM_ON: "Теперь ваш персонаж будет автоматически атаковать ближайшего врага.",
            AUTO_AIM_OFF: "Теперь ваш персонаж не будет автоматически атаковать ближайшего врага.",

            AUTO_ULTI_ON: "Теперь ваш персонаж будет автоматически ультовать в ближайшего врага.",
            AUTO_ULTI_OFF: "Теперь ваш персонаж не будет автоматически ультовать в ближайшего врага.",

            HOLD_TO_SHOOT_ON: "Автоатака при зажатии кнопки атаки включена.",
            HOLD_TO_SHOOT_OFF: "Автоатака при зажатии кнопки атаки выключена.",

            MOVEMENT_BASED_AUTOSHOOT_ON: "Автоатака по направлению движения (для Мортиса) включена.",
            MOVEMENT_BASED_AUTOSHOOT_OFF: "Автоатака по направлению движения (для Мортиса) выключена.",

            LEGACY_BACKGROUND_ON: "Теперь темы в меню менее детализированные.",
            LEGACY_BACKGROUND_OFF: "Теперь темы в меню более детализированные.",

            OWN_PLAYER_TEAM: "Истинная команда игрока: {0}",

            RED: "<cff2600>К<cff2600>Р<cff2600>А<cff2600>С<cff2600>Н<cff2600>А<cff2600>Я</c>",
            BLUE: "<c0433ff>С<c0433ff>И<c0433ff>Н<c0433ff>Я<c0433ff>Я</c>",

            SHOW_SESSION_TIME_ON: "Время сессии отображается.",
            SHOW_SESSION_TIME_OFF: "Время сессии больше не отображается.",

            SHOW_CURRENT_TIME_ON: "Текущее время отображается",
            SHOW_CURRENT_TIME_OFF: "Текущее время больше не отображается",

            SHOW_FPS_ON: "FPS отображается",
            SHOW_FPS_OFF: "FPS больше не отображается",

            SHOW_TEAM_ON: "Теперь в бою будет отображаться ваша настоящая команда.",
            SHOW_TEAM_OFF: "Теперь в бою не будет отображаться ваша настоящая команда.",

            SHOW_NAME_ON: "Имена игроков снова отображаются.",
            SHOW_NAME_OFF: "Имена игроков больше не отображаются.",

            SHOW_TAGS_ON: "Теги игроков снова отображаются.",
            SHOW_TAGS_OFF: "Теги игроков больше не отображаются.",

            SFX_ON: "Звук включен",
            SFX_OFF: "Звук выключен.",

            MUSIC_ON: "Музыка включена.",
            MUSIC_OFF: "Музыка выключена.",

            HAPTICS_ON: "Вибрация включена.",
            HAPTICS_OFF: "Вибрация выключена",

            ENEMY_BULLETS_ON: "Отображение пуль у противников включено!",
            ENEMY_BULLETS_OFF: "Отображение пуль у противников отключено!",

            BATTLE_PING_ON: "Отображение пинга в бою включено!",
            BATTLE_PING_OFF: "Отображение пинга в бою отключено!",

            SKIP_BATTLE_END_REPLAY_ON: "«ЛУЧШИЙ МОМЕНТ» больше не будет показываться после конца боя",
            SKIP_BATTLE_END_REPLAY_OFF: "«ЛУЧШИЙ МОМЕНТ» снова будет показываться после конца боя",

            FOLLOW_ALLY_ON: "Теперь Ваш персонаж будет преследовать ближайшего союзника.",
            FOLLOW_ALLY_OFF: "Ваш персонаж больше не будет преследовать ближайшего союзника.",

            CAMERA_MODE_CHANGED: "Режим камеры изменён на: {cameraMode}",
            CAMERA_MODE_0: "Обычный",
            CAMERA_MODE_1: "Вид с угла",
            CAMERA_MODE_2: "Вид всей карты",
            CAMERA_MODE_3: "Кастомный (менять в Battle->Battle Settings)",

            LOLA_CONTROL_0: "Теперь ты можешь контролировать ЛОЛУ и ЕЁ КЛОНА!",
            LOLA_CONTROL_1: "Теперь ты можешь контролировать только ЛОЛУ!",
            LOLA_CONTROL_2: "Теперь ты можешь контролировать только КЛОНА ЛОЛЫ!",

            SPECTATE_TAG: "Наблюдение по тегу",
            SPECTATE_INPUT: "#2PP",
            SPECTATE: "Наблюдать",
            SPECTATE_TAG_NO_CODE: "Ты не ввёл тег.",
            SPECTATE_TAG_WRONG_CODE: "Некорректный тег!",

            PROFILE_TAG: "Открыть профиль по тегу",
            PROFILE_INPUT: "#2PP",
            PROFILE: "Открыть",
            PROFILE_TAG_NO_CODE: "Ты не ввёл тег.",
            PROFILE_TAG_WRONG_CODE: "Некорректный тег!",

            OPEN_URL: "Введи сюда ссылку...",
            INCORRECT_URL: "Некорректная ссылка!",
            OPEN_URL_BUTTON: "Открыть",

            NOT_IMPLEMENTED_YET: "Эта функция еще не реализована!",
            NOT_IMPLEMENTED_YET_IOS: "Эта функция ещё не реализована на iOS!",
            NOT_IMPLEMENTED_YET_ANDROID: "Эта функция ещё не реализована на Android!",

            BOT_PREFIX_ON: "Префикс <c3>[BOT]</c> будет показываться в реальном бою у ботов.",
            BOT_PREFIX_OFF: "Префикс <c3>[BOT]</c> больше не будет показываться.",

            CHAT_BUTTON_ON: "Теперь кнопка чата будет показываться в бою!",
            CHAT_BUTTON_OFF: "Теперь кнопка чата не будет показываться в бою!",

            // /name
            NAME_CMD_WRONG_INPUT: "/name [тег] [ник]",
            NAME_CMD_INVALID_TAG: "Имя этого игрока нельзя поменять!",

            BATTLE_INFO_ON: "Информация боя будет показываться!",
            BATTLE_INFO_OFF: "Информация боя больше не будет показываться!",

            // Braille
            BRAILLE_ON: "Активирован режим трости!\nИгра перезапустится через 4s.",
            BRAILLE_OFF: "Режим трости деактивирован.\nИгра перезапустится через 4s.",
            BRAILLE_INTERRUPTED: "Смена режима трости была прервана.",

            DARK_THEME_ON: "Тёмная тема включена!\nДля применения всех настроек, игра перезапустится через 4 секунды.",
            DARK_THEME_OFF: "Тёмная тема отключена!\nДля применения всех настроек, игра перезапустится через 4 секунды.",
            DARK_THEME_INTERRUPTED: "Смена тёмной темы была прервана.",

            STATUS_REVERTED: "Статус в команде вернулся в <c00ff00>нормальное</c> состояние",
            STATUS_CHANGED: "Статус в команде изменен на %STATUS",

            TAG_COPIED: "Тег скопирован!",
            IOS_TOO_OLD: "<cfff700>Вы используете устаревшую версию Gene Brawl для iOS. Пожалуйста, установите новый .ipa в ветке \"Обновления\".</c>",
            ANTI_OUT_OF_SYNC: "<cfff700>У вас активировано \"Обход потери соединения\", отключите если вам он не нужен.</c>",

            XRAY_TARGET_SELECTED: "Цель для X-Ray %TARGET выбрана!",

            MARK_FAKE_NINJA_ON: "Теперь клон Леона будет подсвечиваться красным.",
            MARK_FAKE_NINJA_OFF: "Теперь клон Леона не будет подсвечиваться красным.",

            CHANGELOGS_SCRIPTVERSION: "версия скрипта: {scriptVersion}",
            CHANGELOGS_ADDITIONS: "Нововведения",
            CHANGELOGS_FIXES: "Исправления",
            CHANGELOGS_REMOVALS: "Удалено",
            CHANGELOGS_DIALOG_TITLE: "Список изменений",
            CHANGELOGS_DIALOG_BUTTON: "Понятно",

            SKIP_RANDOM_ANIMATION_ON: "Старр Дропы будут готовы к открытию сразу.",
            SKIP_RANDOM_ANIMATION_OFF: "Старр Дропы нужно будет задерживать/нажимать для открытия.",

            HIDE_HEROES_INTRO_ON: "Бравлеры теперь скрыты в интро!",
            HIDE_HEROES_INTRO_OFF: "Бравлеры снова показываются в интро!",

            HIDE_LEAGUE_BATTLE_CARD_ON: "Фон боевой карты теперь скрыт в интро!",
            HIDE_LEAGUE_BATTLE_CARD_OFF: "Фон боевой карты снова показывается в интро!",

            USE_OLD_INTRO_ON: "Используется старое интро в бою.",
            USE_OLD_INTRO_OFF: "Используется новое интро в бою.",

            CANNOT_SEE_PROFILE_IN_BATTLE: "Нельзя смотреть профиль в бою!",
            LEAVE_FROM_BATTLE: "ВЫХОДИМ ИЗ БОЯ...",

            ACCOUNT: "Аккаунт",
            BATTLE: "Бой",
            LATENCY: "Смена боевого сервера",
            CAMERA_MODE: "Режим камеры",
            CHANGE_THEME: "Сменить тему",
            FUN: "Забавки",
            GFX: "Графика",
            PRC_CHINA: "Китай",
            GAME_SETTINGS: "Настройки игры",
            OPTIMIZATION: "Оптимизация",
            PROXY: "Прокси",
            SC_UTILS: "SC Utils",
            SERVERS: "Сервера",
            TESTS: "Коляски (тесты)",
            USEFUL_INFO: "Полезная информация",
            EXPERIMENTS: "Эксперименты",
            XRAY: "X-Ray",
            MISC: "Разное",
            PREVIEW: "Превью",
            SC_ID: "Supercell ID",
            BRAWL_PASS: "Brawl Pass",
            CHALLENGE: "Испытания",
            STREAMER_MODE: "Режим стримера",
            SPAM: "Спам",
            GEARS: "Снаряжение",
            CHANGE_STATUS: "Сменить статус",
            MAIN: " ",

            BUTTONS_OPACITY: "Непрозрачность кнопок",
            CAMERA_X: "Позиция камеры по X",
            CAMERA_Y: "Позиция камеры по Y",
            CAMERA_ROTATE_X: "Поворот камеры по X",
            CAMERA_ROTATE_Y: "Поворот камеры по Y",
            CAMERA_ALIGN: "Выравнивание камеры",
            CAMERA_DISTANCE: "Дистанция камеры",

            USER_IMAGE_MANAGER_LOADED_SUCCESSFULLY: "Картинка успешно загружена! Перезайдите в это меню, чтобы увидень новую картинку.",
            USER_IMAGE_MANAGER_ERROR_WHILE_LOADING: "Произошла ошибка при попытке загрузить картинку!",

            USER_IMAGE_SCREEN_TITLE: "Выберите картинку",
            USER_IMAGE_BUTTON_LOAD_IMAGE: "Загрузить свою картинку",

            USER_IMAGE_SELECTED_TITLE: "Картинка выбрана!",
            USER_IMAGE_SELECTED_BODY: "Что вы хотите сделать с этой картинкой?",
            USER_IMAGE_SELECTED_BUTTON_SET_TO_THEME: "Поставить в главное меню",
            USER_IMAGE_SELECTED_BUTTON_DELETE: "Удалить",

            USER_IMAGE_SET_TO_THEME_SUCCESS: "Картинка установлена в главное меню!",

            USER_IMAGE_DELETE_SUCCESS: "Картинка удалена!",
            USER_IMAGE_DELETE_ERROR: "Не удалось удалить картинку.",

            DANGEROUS_POPUP_TITLE: "Минуточку внимания!",
            DANGEROUS_POPUP_BODY: 'Вы точно хотите включить функцию "{functionName}"? Эта функция отмечена как <cff0000>опасная</c> и может привести к блокировке вашего аккаунта! Вся ответственность за блокировку вашего аккаунта лежит только на вас!',

            DANGEROUS_POPUP_BUTTON_NO: "Нет, спасибо!",
            DANGEROUS_POPUP_BUTTON_YES: "Да, хочу.",

            ANTI_KNOCKBACK: "Анти-отбрасывание",
            ANTI_KB_ON: "Анти-отбрасывание включено!",
            ANTI_KB_OFF: "Анти-отбрасывание выключено!",

            SHOW_TICKS: "Показывать время с начала боя",
            SHOW_TICKS_ON: "Теперь в бою будет отображаться время с начала боя!",
            SHOW_TICKS_OFF: "Теперь в бою не будет отображаться время с начала боя!",

            DISABLE_OUTLINE_ON: "Обводка отключена!",
            DISABLE_OUTLINE_OFF: "Обводка включена!"

        },
        EN: {
            RESTART_GAME: "Restart Game",
            ADD_RESOURCES: "Add Resources",
            ADD_GEMS: "Add Gems",
            BYPASS_OUT_OF_SYNC: "Bypass Out of Sync",
            REMOVE_ALL_COINS: "Remove all Coins",
            REMOVE_ALL_GEMS: "Remove all Gems",
            UNLOCK_ALL_LVL7: "Unlock All to Level 7",
            UNLOCK_ALL_LVL9: "Unlock All to Level 9",
            UNLOCK_GADGETS: "Unlock opened gadgets",
            UNLOCK_STAR_POWERS: "Unlock opened star powers",
            UNLOCK_ONE: "Unlock One",
            UNLOCK_MAX_ONE: "Unlock and Max One",
            UNLOCK_ALL: "Unlock All",
            UNLOCK_MAX_ALL: "Unlock and Max All",
            UNLOCK_MAX_ALL_NO_STAR_POWERS: "Unlock and Max All without star powers",
            UNLOCK_EVENT_SLOTS: "Unlock Event Slots",
            REMOVE_HERO_SKINS: "Remove hero skins",
            ADD_POWER: "Add power",
            ADD_SCORE: "Add score",
            DECREASE_SCORE: "Decrease score",
            CLAIM_35_MILESTONES: "Claim 35 milestones",
            ADD_1_WINSTREAK: "Add 1 winstreak",
            ADD_10_WINSTREAK: "Add 10 sinstreak",
            ADD_100_WINSTREAK: "Add 100 winstreak",
            REMOVE_WINSTREAK: "Remove winstreak",
            ADD_1000_BLINGS: "Add 1000 blings",
            PROFILE_BY_TAG: "Open profile by tag",
            NEXT_CAMERA_MODE: "Next camera mode",
            HIDE_LOBBY_INFO: "Hide Lobby Info",
            DISABLE_SPOOF: "Disable spoof",
            DEBUG_INFO: "Debug Info",
            DEBUG_OPEN_URL: "Open URL",
            OPEN_ACCOUNT_SWITCHER: "Open account switcher",
            HIDE_SIDE_MASK: "Hide side mask",
            DARK_THEME: "Dark theme",
            AUTO_AIM: "Auto aim",
            AUTO_ULTI: "Auto ulti",
            AUTO_HYPERCHARGE: "Auto hypercharge",
            HOLD_TO_SHOOT: "Hold to shoot",
            AUTO_MOVE_TO_TARGET: "Auto move to target",
            FOLLOW_CLOSEST_TEAMMATE: "Follow closest teammate",
            AUTO_PLAY_AGAIN: "Auto play again",
            SEND_EMPTY_EMOTE: "Send empty emote",
            SKIP_REPLAY_INTRO: "Skip replay intro",
            SKIP_BATTLE_END_REPLAY: "Skip battle end replay",
            AUTO_READY: "Auto ready",
            BATTLE_SETTINGS: "Camera settings",
            SHOW_CHAT_BUTTON: "Show chat button",
            SHOW_ENEMY_AMMO: "Show enemy ammo",
            KIT_MOVE_HACK: "Kit move when attached",
            ADD_BRAWL_PASS_POINTS_THIS_SEASON: "Add Brawl Pass points this season",
            ADD_CHAMPIONSHIP_CHALLENGE_WIN: "Add Championship Challenge Win",
            ADD_CHAMPIONSHIP_CHALLENGE_LOSS: "Add Championship Challenge Loss",
            SET_CC_ESPORTS_QUALIFIED: "Set CC/Esports Qualified",
            REMOVE_CC_ESPORTS_QUALIFIED: "Remove CC/Esports Qualified",
            FORCE_CHINA_GFX_TWEAKS: "Force China GFX Tweaks",
            HIDE_DEBUG_ITEMS: "Hide debug items",
            HIDE_TAGS: "Hide tags",
            HIDE_NAME: "Hide name",
            START_ROOM_SPAM: "Start room spam",
            STOP_ROOM_SPAM: "Stop room spam",
            SWITCH_TO_STAGE_SERVER: "Switch to Stage server",
            SWITCH_TO_PROD_SERVER: "Switch to Production server",
            UNLOCK_GEARS: "Unlock Gears",
            UNLOCK_CURRENT_BRAWL_PASS_SEASON: "Unlock Current Brawl Pass Season",
            UNLOCK_CURRENT_BRAWL_PASS_PLUS_SEASON: "Unlock current Brawl Pass Plus Season",
            SKIN_CHANGER: "Skin changer",
            ONLINE_SKIN_CHANGER: "Online mode",
            DOUBLE_CLICK_TO_SET_THEME_MUSIC: "Tap again to change music!",
            HIDE_ULTI_AIMING: "Hide ulti aiming",
            STATIC_BACKGROUND: "Static background",
            ANTI_AFK: "Anti AFK",
            HIDE_SPECIAL_OFFERS: "Hide special offers",
            CHARACTER_SOUNDS: "Character sounds",
            HIDE_BRAWLERS_IN_INTRO: "Hide brawlers in intro",
            HIDE_LEAGUE_IN_BATTLE_CARD: "Hide league in battle card",
            USE_OLD_INTRO: "Use old intro",
            BYPASS_ANTI_PROFANITY: "Bypass anti profanity",
            CLOSE_RANKED_SCREEN: "Close Ranked screen",
            SLOW_MODE: "Slow mode",
            VISUAL_CHROMATIC_NAME: "Visual chromatic name",
            DISABLE_OUTLINE: "Disable outline",
            EMOTE_ANIMATION: "Emote animation",
            SHOW_FUTURE_EVENTS: "Show future events",
            HIDE_CREATOR_BOOST: "Hide creator boost",
            SHOW_BOT_PREFIX: "Show bot prefix",
            USE_LEGACY_BACKGROUND: "Use legacy background",
            SKIP_STARR_DROP_ANIMATION: "Skip starr drop animation",
            MOVEMENT_BASED_AUTOSHOOT: "Movement based autoshoot",
            SPECTATE_BY_TAG: "Spectate by tag",
            AUTO_DODGE: "Auto dodge",
            HIDE_BATTLE_STATE: "Hide battle state",
            AUTO_EXIT_AFTER_BATTLE: "Auto exit after battle",
            MARK_FAKE_LEON: "Mark fake Leon",
            SHOW_FPS: "Show FPS",
            SHOW_TIME: "Show time",
            SHOW_SESSION_TIME: "Show session time",
            SHOW_OWN_TEAM: "Show own team",
            SHOW_BATTLE_INFO: "Show battle info",
            SHOW_BATTLE_PING: "Show battle ping",
            CHANGELOGS: "Changelogs",
            SFX: "SFX",
            MUSIC: "Music",
            HAPTICS: "Haptics",
            PROBING_CANE_MODE: "Probing cane mode",
            ADVANCED_PROBING_CANE_MODE: "Advanced probing cane mode",
            SPAWN_DVD: "Spawn 1 DVD",
            REMOVE_DVD: "Remove 1 DVD",
            REMOVE_ALL_DVD: "Remove all DVD",
            CURRENT_SERVER_THEME: "Current server theme",
            NO_PROXY: "No proxy",
            STATUS_NORMAL: "<c00ff00>NORMAL</c>",

            TEST: "Test!",
            AGE_GATE_REMOVAL_STARTED: "The Age Gate dialog has been opened. Please enter an age of 21 or above to remove restrictions.",

            HIDE_ULTI_AIMING_ON: "Others will now won't see when you aim ulti!",
            HIDE_ULTI_AIMING_OFF: "Others will now see when you aim ulti!",


            EDIT_CONTROLS_ON: "Edit controls button now <c41fc03>will</c> be shown in battle.",
            EDIT_CONTROLS_OFF: "Edit controls button now <cfff700>won't</c> be shown in battle.",

            BATTLE_SHORTCUTS_ON: "Battle shortcuts now <c41fc03>will</c> be shown in battle.",
            BATTLE_SHORTCUTS_OFF: "Battle shortcuts now <cfff700>won't</c> be shown in battle.",

            SHOW_EDIT_CONTROLS: "Show edit controls button",
            SHOW_BATTLE_SHORTCUTS: "Show battle shortcuts",

            AUTO_PLAY_AGAIN_ON: "Now you will play again automatically after end of the battle.",
            AUTO_PLAY_AGAIN_OFF: "Now you won't play again automatically after end of the battle.",
            AUTO_EXIT_AFTER_BATTLE_ON: "Now you will exit after battle automatically.",
            AUTO_EXIT_AFTER_BATTLE_OFF: "Now you won't exit after battle automatically.",
            SKIP_REPLAY_INTRO_ON: "Any replay intro will be skipped now.",
            SKIP_REPLAY_INTRO_OFF: "Any replay intro won't be skipped now.",
            ANTI_AFK_ON: "Anti AFK enabled.",
            ANTI_AFK_OFF: "Anti AFK disabled.",

            ANTI_PROFANITY_ON: "Anti-Profanity is enabled! Be careful, you may be banned for using bad words!",
            ANTI_PROFANITY_OFF: "Anti-Profanity is disabled.",

            PROXY_ERROR: "Looks like the proxy didn't work",
            PROD_SERVER_UPDATED: "You need to update client! You can update Gene Brawl here: t.me/gene_land",
            STAGE_SERVER_UPDATED: "Stage server was updated to new version! Unfortuanely, there's no way to download new client for it :(",
            STAGE_SERVER_REQUIRES_VPN: "Stage server is unavailable from your location.",

            LATENCY_TESTS_TRIGGERED: "Changing battle server, wait...",
            BATTLE_SERVER_CHANGED: "Battle server changed!",
            BATTLE_SERVER_SPOOF_DISABLED: "Battle server spoof is disabled!",

            KIT_MOVE_HACK_ON: "Now Kit can move while attached.",
            KIT_MOVE_HACK_OFF: "Now Kit can't move while attached.",

            AUTO_READY_ON: "Now when entering menu you will be auto \"READY\". (Only in team)",
            AUTO_READY_OFF: "Now when entering menu you won't be auto \"READY\".",

            AUTO_HYPERCHARGE_ON: "Now hypercharge will be auto activated.",
            AUTO_HYPERCHARGE_OFF: "Now hypercharge won't be auto activated.",

            // Activation
            NEED_TO_ACTIVATE: "Hey, you need to activate a mod! Type (/activate $KEY) in \"SCUtils\" topic",
            KEY_UNAVAILABLE: "Hi! Looks like activation server isn't available right now. Try login later!",

            // Team spam
            TEAM_SPAM_INIT: "Spam is starting!",
            TEAM_SPAM_STOPPED: "Spam stopped!",
            TEAM_SPAM_CANCELLED: "Spam cancelled.",
            TEAM_SPAM_NOT_RUNNING: "Spam was not running",

            // Out Of Sync
            OUT_OF_SYNC_ON: "You will not be disconnected if you select something you don't have.",
            OUT_OF_SYNC_OFF: "You will be DISCONNECTED if you select something you don't have.",

            // Content Creator Boost
            CONTENT_CREATOR_BOOST_ON: "Content creator boost enabled.",
            CONTENT_CREATOR_BOOST_OFF: "Content creator boost disabled.",

            // Battle State
            BATTLE_STATE_HIDDEN: "Battle state is hidden.",
            BATTLE_STATE_VISIBLE: "Battle state is visible.",

            // Slow mode
            SLOW_MODE_ON: "Slow mode is enabled",
            SLOW_MODE_OFF: "Slow mode is disabled",

            // Side Mask
            SIDE_MASK_ON: "Side mask is enabled",
            SIDE_MASK_OFF: "Side mask is disabled",

            // Fake Premium Pass
            FAKE_PREMIUM_PASS_ON: "Visual chromatic name is enabled!",
            FAKE_PREMIUM_PASS_OFF: "Visual chromatic name is disabled!",

            // Future Events
            FUTURE_EVENTS_ON: "Future events are visible!",
            FUTURE_EVENTS_OFF: "Future events are hidden!",

            // Debug Items
            DEBUG_ITEMS_HIDDEN: "Debug items are hidden. If you want to enable, type /debug command in chat.",
            DEBUG_ITEMS_VISIBLE: "Debug items are visible.",

            // Emote animation
            EMOTE_ANIMATION_ON: "Emote animation is enabled",
            EMOTE_ANIMATION_OFF: "Emote animation is disabled!",

            NO_COMMAND_DEFINED: "No command defined!",

            PROXY_OFF: "Proxy is disabled! The next time you enter the game, the proxy will not be used!",

            STATIC_BACKGROUND_ON: "Some game menus will now use the background from the main menu!",
            STATIC_BACKGROUND_OFF: "Some game menus will now use a default background!",

            CONNECTION_INDICATOR_ON: "Your connection to the server will now be displayed in battle!",
            CONNECTION_INDICATOR_OFF: "Now your connection to the server will not be displayed in battle!",

            SPECIAL_OFFERS_ON: "Special offers now hidden!",
            SPECIAL_OFFERS_OFF: "Special offers now are displayed!",

            CHINA_VERSION_ON: "The game's client now uses Chinese add-ons.",
            CHINA_VERSION_OFF: "Now the game client doesn't use Chinese add-ons.",

            AUTO_MOVE_TARGET_ON: "Now your character will automatically move to the closest enemy.",
            AUTO_MOVE_TARGET_OFF: "Now your character won't automatically move to the closest enemy.",

            AUTO_AIM_ON: "Now your character will automatically attack the closest enemy.",
            AUTO_AIM_OFF: "Now your character won't automatically attack the closest enemy.",

            AUTO_ULTI_ON: "Now your character will automatically ULTI attack the closest enemy.",
            AUTO_ULTI_OFF: "Now your character won't automatically ULTI attack the closest enemy.",

            HOLD_TO_SHOOT_ON: "Autoattack while holding attack stick enabled.",
            HOLD_TO_SHOOT_OFF: "Autoattack while holding attack stick disabled.",

            MOVEMENT_BASED_AUTOSHOOT_ON: "Movement based autoattack (Mortis) enabled.",
            MOVEMENT_BASED_AUTOSHOOT_OFF: "Movement based autoattack (Mortis) disabled.",

            OWN_PLAYER_TEAM: "Own player team: {0}",

            RED: "<cff2600>R<cff2600>E<cff2600>D</c>",
            BLUE: "<c0433ff>B<c0433ff>L<c0433ff>U<c0433ff>E</c>",

            SHOW_SESSION_TIME_ON: "Session time is now displayed.",
            SHOW_SESSION_TIME_OFF: "Session time is no longer displayed.",

            SHOW_CURRENT_TIME_ON: "Current time is now displayed.",
            SHOW_CURRENT_TIME_OFF: "Current time is no longer displayed.",

            SHOW_FPS_ON: "FPS is now displayed.",
            SHOW_FPS_OFF: "FPS is no longer displayed.",

            SHOW_TEAM_ON: "Your actual team will now be displayed in battle.",
            SHOW_TEAM_OFF: "Now your real command will not be displayed in battle.",

            SHOW_NAME_ON: "Player names is now displayed.",
            SHOW_NAME_OFF: "Player names is no longer displayed.",

            SHOW_TAGS_ON: "Player tags is now displayed.",
            SHOW_TAGS_OFF: "Player tags is no longer displayed.",

            SFX_ON: "Sound is now enabled.",
            SFX_OFF: "Sound is now disabled.",

            MUSIC_ON: "Music is now enabled.",
            MUSIC_OFF: "Music is now disabled.",

            HAPTICS_ON: "Haptics is now enabled.",
            HAPTICS_OFF: "Haptics is now disabled.",

            ENEMY_BULLETS_ON: "Showing enemy's bullets enabled!",
            ENEMY_BULLETS_OFF: "Showing enemy's bullets disabled!",

            BATTLE_PING_ON: "Showing ping in battle enabled!",
            BATTLE_PING_OFF: "Showing ping in battle disabled!",

            SKIP_BATTLE_END_REPLAY_ON: "«GAME HIGHLIGHT» is no longer displayed after the end of battle.",
            SKIP_BATTLE_END_REPLAY_OFF: "«GAME HIGHLIGHT» is now displayed after the end of battle.",

            FOLLOW_ALLY_ON: "Now your character will follow closest teammate.",
            FOLLOW_ALLY_OFF: "Now your character won't follow closest teammate.",

            NOT_IMPLEMENTED_YET: "This feature is not implemented yet! We will implement it later.",
            NOT_IMPLEMENTED_YET_IOS: "This feature is not implemented yet for iOS! We will implement it later.",
            NOT_IMPLEMENTED_YET_ANDROID: "This feature is not implemented yet for Android! We will implement it later.",

            GENE_PROXY: "Gene proxy enabled! Restart game to apply changes.",
            PROXY_DISABLED: "Proxy is disabled! Restart game to apply changes.",

            DEFAULT_THEME_ON: "Default theme is enabled",
            DEFAULT_THEME_OFF: "Default theme is disabled!",

            CAMERA_MODE_CHANGED: "Camera mode changed to: {cameraMode}",
            CAMERA_MODE_0: "Default",
            CAMERA_MODE_1: "Corner view",
            CAMERA_MODE_2: "Map view",
            CAMERA_MODE_3: "Custom (you can change camera settings in Battle->Battle Settings)",

            LOLA_CONTROL_0: "Now you can control LOLA and HER CLONE!",
            LOLA_CONTROL_1: "Now you can control only LOLA!",
            LOLA_CONTROL_2: "Now you can control only LOLA'S CLONE!",

            SPECTATE_TAG: "SPECTATE BY TAG",
            SPECTATE_INPUT: "#2PP",
            SPECTATE: "SPECTATE",
            SPECTATE_TAG_NO_CODE: "You didn't put tag!",
            SPECTATE_TAG_WRONG_CODE: "Incorrect tag!",

            PROFILE_TAG: "OPEN PROFILE BY TAG",
            PROFILE_INPUT: "#2PP",
            PROFILE: "OPEN",
            PROFILE_TAG_NO_CODE: "You didn't put tag!",
            PROFILE_TAG_WRONG_CODE: "Incorrect tag!",

            OPEN_URL: "Input URL here...",
            INCORRECT_URL: "Invalid URL!",
            OPEN_URL_BUTTON: "Open",

            BOT_PREFIX_ON: "<c3>[BOT]</c> prefix is now displayed.",
            BOT_PREFIX_OFF: "<c3>[BOT]</c> prefix is no longer displayed.",

            CHAT_BUTTON_ON: "Chat button will now be displayed in battle.",
            CHAT_BUTTON_OFF: "Chat button will now not be displayed in battle.",

            // /name
            NAME_CMD_WRONG_INPUT: "/name [tag] [name]",
            NAME_CMD_INVALID_TAG: "Name for this player can't be changed!",

            BATTLE_INFO_ON: "Battle info is now displayed.",
            BATTLE_INFO_OFF: "Battle info is no longer displayed.",

            // Braille
            BRAILLE_ON: "Probing cane mode enabled!\nGame will reload in 4s.",
            BRAILLE_OFF: "Probing cane mode disabled.\nGame will reload in 4s.",
            BRAILLE_INTERRUPTED: "Probing cane mode change was interrupted.",

            DARK_THEME_ON: "Dark theme is enabled!\nGame will reload in 4s.",
            DARK_THEME_OFF: "Dark theme is disabled!\nGame will reload in 4s.",
            DARK_THEME_INTERRUPTED: "Dark theme changing was interrupted.",

            TAG_COPIED: "Tag was copied!",
            IOS_TOO_OLD: "<cfff700>You are using outdated Gene Brawl version for iOS. Please, update using new .ipa in \"Обновления\" topic.</c>",
            ANTI_OUT_OF_SYNC: "<cfff700>You have \"Bypass Out Of Sync\" activated, disable it if you don't need it anymore.</c>",

            XRAY_TARGET_SELECTED: "Xray target %TARGET selected!",

            STATUS_REVERTED: "Team status is back to <c00ff00>NORMAL</c>",
            STATUS_CHANGED: "Team status changed to %STATUS",

            LEGACY_BACKGROUND_ON: "Legacy menu theme enabled.",
            LEGACY_BACKGROUND_OFF: "Legacy menu theme disabled.",

            MARK_FAKE_NINJA_ON: "Leon's clone will be marked red.",
            MARK_FAKE_NINJA_OFF: "Leon's clone will not be marked red.",

            CHANGELOGS_SCRIPTVERSION: "script version: {scriptVersion}",
            CHANGELOGS_ADDITIONS: "Added",
            CHANGELOGS_FIXES: "Fixed",
            CHANGELOGS_REMOVALS: "Removed",
            CHANGELOGS_DIALOG_TITLE: "Change logs",
            CHANGELOGS_DIALOG_BUTTON: "OK",

            SKIP_RANDOM_ANIMATION_ON: "Starr Drops will be open immediately now.",
            SKIP_RANDOM_ANIMATION_OFF: "You need to hold/tap Starr Drops now.",

            HIDE_HEROES_INTRO_ON: "Brawlers is now hidden in intro!",
            HIDE_HEROES_INTRO_OFF: "Brawlers is now shown in intro!",

            HIDE_LEAGUE_BATTLE_CARD_ON: "Battle card background is now hidden in intro!",
            HIDE_LEAGUE_BATTLE_CARD_OFF: "Battle card background is now shown in intro!",

            USE_OLD_INTRO_ON: "Using OLD intro now.",
            USE_OLD_INTRO_OFF: "Using NEW intro now.",

            CANNOT_SEE_PROFILE_IN_BATTLE: "It's not possible to see profiles in battle!",
            ACCOUNT: "Account",
            BATTLE: "Battle",
            LATENCY: "Latency",
            CAMERA_MODE: "Camera Mode",
            CHANGE_THEME: "Change Theme",
            FUN: "Fun",
            GFX: "GFX",
            PRC_CHINA: "PRC / China",
            GAME_SETTINGS: "Game Settings",
            OPTIMIZATION: "Optimization",
            PROXY: "Proxy",
            SC_UTILS: "SC Utils",
            SERVERS: "Servers",
            TESTS: "Tests",
            USEFUL_INFO: "Useful Info",
            EXPERIMENTAL: "Experiments",
            XRAY: "X-Ray",
            MISC: "Miscellaneous",
            PREVIEW: "Preview",
            SC_ID: "Supercell ID",
            BRAWL_PASS: "Brawl Pass",
            CHALLENGE: "Challenge",
            STREAMER_MODE: "Streamer Mode",
            SPAM: "Spam",
            GEARS: "Gears",
            CHANGE_STATUS: "Change Status",
            MAIN: " ",

            BUTTONS_OPACITY: "Buttons Opacity",
            CAMERA_X: "Camera X",
            CAMERA_Y: "Camera Y",
            CAMERA_ROTATE_X: "Camera Rotate X",
            CAMERA_ROTATE_Y: "Camera Rotate Y",
            CAMERA_ALIGN: "Camera Align",
            CAMERA_DISTANCE: "Camera Distance",

            USER_IMAGE_MANAGER_LOADED_SUCCESSFULLY: "Image has been successfully loaded! Reload this menu to see the new picture.",
            USER_IMAGE_MANAGER_ERROR_WHILE_LOADING: "Error occured while trying to load a picture!",

            USER_IMAGE_SCREEN_TITLE: "Select image",
            USER_IMAGE_BUTTON_LOAD_IMAGE: "Load own image",

            USER_IMAGE_SELECTED_TITLE: "Image seleted!",
            USER_IMAGE_SELECTED_BODY: "What do you want to do with this image?",
            USER_IMAGE_SELECTED_BUTTON_SET_TO_THEME: "Set to main menu as theme",
            USER_IMAGE_SELECTED_BUTTON_DELETE: "Delete",

            USER_IMAGE_SET_TO_THEME_SUCCESS: "Image has been set to main menu as theme!",

            USER_IMAGE_DELETE_SUCCESS: "Image deleted!",
            USER_IMAGE_DELETE_ERROR: "Failed to delete image.",

            DANGEROUS_POPUP_TITLE: "Hold on!",
            DANGEROUS_POPUP_BODY: 'Are you sure you want to enable "{functionName}" function? This function is marked as <cff0000>dangerous</c> and may result in your account being blocked! All responsibility for your account rests solely with you!',

            DANGEROUS_POPUP_BUTTON_NO: "No, thanks!",
            DANGEROUS_POPUP_BUTTON_YES: "Sure, why not.",

            ANTI_KNOCKBACK: "Anti-Knockback",
            ANTI_KB_ON: "Anti-Knockback enabled!",
            ANTI_KB_OFF: "Anti-Knockback disabled!",

            PROTECTIVE_FEATURES: "Protective features",
            PROTECTIVE_FEATURES_ON: "Protective features enabled! <cff0900>Attention!</c> This function is still in development and may be unstable.",
            PROTECTIVE_FEATURES_OFF: "Protective features disabled.",

            SHOW_TICKS: "Show battle time",
            SHOW_TICKS_ON: "Battle time is now displayed!",
            SHOW_TICKS_OFF: "Battle time is no longer displayed.",

            DISABLE_OUTLINE_ON: "Outline was disabled!",
            DISABLE_OUTLINE_OFF: "Outline was enabled!"
        }
    };
}
