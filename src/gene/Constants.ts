export class Constants {
    static POPUPBASE_PATCH_DISALLOWED_REPLACEMENTS = ['Brawlbox_info_popup', 'gatcha_screen_hud_noBox', 'random_reward_opening', 'seasonend_popup', 'team_up_popup', 'create_name_popup', 'age_gate_dialog', 'age_gate_number_pad_dialog'];
    static DARK_THEME_REPLACEMENT = "Arcade"; // Replace if disabled
    static DARK_THEME_SHOWDOWN_REPLACEMENT = "ArcadeShowdown";

    static UNAVAILABLE_KEY_STRING = "unavailable :(";

    static ANTIPROFANITY_BYTES = "\uFE00";

    static COMBATHUD_ALPHA_OFFSETS: number[] = [
        888 // virtuastick_move_bg
        //896, // virtuastick_move_stick
        //904, // virtuastick_attack_bg
        //984, // special_shot
        //912, // virtuastick_attack_stick
        //936, // movement_dot
        //1032, // virtuastick_ulti_bg ?
        //920, // virtuastick_ulti_bg ?
        //1448, //emote ?
        //1432 // overcharge_button

        /*912,
        928, // ulti_stick
        // 352,
        // 1240
        1424, // button_use_item
        944, // button_use_item*/
    ];
}
