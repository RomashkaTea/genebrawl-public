import {Libg} from "../../../libs/Libg";
import {DropGUIContainer} from "./DropGUIContainer";
import {GameButton} from "./GameButton";
import {Storage} from "../../../gene/Storage";
import {GameInputField} from "../input/GameInputField";
import {Configuration} from "../../../gene/Configuration";
import {HomeMode} from "../../../logic/home/HomeMode";
import {LogicConfData} from "../../../logic/home/data/LogicConfData";
import {GlobalID} from "../../../logic/data/GlobalID";
import {LogicDataTables} from "../../../logic/data/LogicDataTables";
import {ResourceManager} from "../../ResourceManager";
import {Resources} from "../../../gene/Resources";
import {LogicThemeData} from "../../../logic/data/LogicThemeData";
import {Constants} from "../../../gene/Constants";
import {MovieClip} from "../MovieClip";
import {HomeScreen} from "../../../logic/home/HomeScreen";
import {Sprite} from "../Sprite";
import {DisplayObject} from "../DisplayObject";

const PopupBase_PopupBase = new NativeFunction(
    Libg.offset(0x5C2AD8, 0x1ACA44), 'pointer', ['pointer', 'pointer', 'pointer', 'bool', 'bool', 'pointer', 'pointer', 'pointer', 'pointer']
);

const PopupBase_setUpScreenHeader = new NativeFunction(
    Libg.offset(0x5F2A28, 0x1ADA60), 'void', ['pointer'] // "button_home"
);

const PopupBase_addContent = new NativeFunction(
    Libg.offset(0x5F2E94, 0x1ADD78), 'void', ['pointer', 'pointer']
);

const updateVtableOffset = 52 * Process.pointerSize;
const fadeOutVtableOffset = 56 * Process.pointerSize;
const closeButtonOffset = 184;
const backgroundMovieClipOffset = 304;
const naviHeightOffset = 344;
const activeInputFieldOffset = 392;

export class PopupBase extends DropGUIContainer {
    protected closeButton?: GameButton;
    private readonly updateFunc: NativeFunction<void, [NativePointerValue, number]>;
    private readonly fadeOutFunc: NativeFunction<void, [NativePointerValue]>;
    private bgMovieClip!: MovieClip;

    constructor(instance: NativePointer, fileName?: string, exportName?: string) {
        if (exportName === "language_popup") {
            PopupBase_PopupBase(instance, fileName!.scptr(), exportName!.scptr(), 1, 0, "".scptr(), "".scptr(), "".scptr(), "".scptr());
        }

        super(instance);

        this.fadeOutFunc = new NativeFunction(this.vtable.add(fadeOutVtableOffset).readPointer(), 'void', ['pointer']);
        this.updateFunc = new NativeFunction(this.vtable.add(updateVtableOffset).readPointer(), 'void', ['pointer', 'float']);

        const closeButtonPtr = this.instance.add(closeButtonOffset);
        if (!closeButtonPtr.isNull()) {
            this.closeButton = new GameButton(closeButtonPtr);
        }
    }

    fadeOut() {
      //  this.fadeOutFunc(this.instance); FIXME crashes
    }

    setActiveInputField(field: GameInputField) {
        this.instance.add(activeInputFieldOffset).writePointer(field.instance);
    }

    setUpScreenHeader() {
        PopupBase_setUpScreenHeader(this.instance);
    }

    update(deltaTime: number) {
        if (this.instance.isNull()) {
            Storage.removePopupByInstance(this.instance);
            return;
        }

        try {
            this.updateFunc(this.instance, deltaTime);
        } catch (e) {
            Storage.removePopupByInstance(this.instance);
        }
    }

    getBackgroundMovieClip() {
        return new MovieClip(
            this.instance.add(backgroundMovieClipOffset).readPointer()
        );
    }

    static getBackgroundMovieClip(instance: NativePointer): MovieClip | null {
        const background = instance.add(backgroundMovieClipOffset).readPointer();

        if (background.isNull())
            return null;

        return new MovieClip(
            background
        );
    }

    setBackgroundMovieClip(movieClip: MovieClip) {
        this.bgMovieClip = movieClip;
        this.instance.add(backgroundMovieClipOffset).writePointer(movieClip.instance);
    }

    addContent(content: DisplayObject) {
        PopupBase_addContent(this.instance, content.instance);
    }

    getNaviHeight() {
        return this.instance.add(naviHeightOffset).readFloat();
    }

    static setBackgroundMovieClip(instance: NativePointer, movieClip: MovieClip) {
        instance.add(backgroundMovieClipOffset).writePointer(movieClip.instance);
    }

    static patch() {
        Interceptor.replace(PopupBase_PopupBase, new NativeCallback(function (popupBase, fileName, exportName, a4, a5, backgroundFilename, backgroundExportname, headerExportName, a9) {
            if (Configuration.staticBackground && !Constants.POPUPBASE_PATCH_DISALLOWED_REPLACEMENTS.includes(exportName.fromsc())) {
                const homeMode = HomeMode.getInstance();
                if (homeMode && !homeMode.isNull()) {
                    const logicConfData = HomeMode.getConfData();

                    const themeId = LogicConfData.getIntValue(logicConfData, 1, 0);
                    const themeInstanceId = GlobalID.getInstanceID(themeId);

                    const currentThemeData = LogicDataTables.getDataById(41, themeInstanceId) as LogicThemeData;

                    backgroundFilename = currentThemeData.getFileName().scptr();
                    backgroundExportname = currentThemeData.getExportName().scptr();
                }
            }

            const instance = PopupBase_PopupBase(popupBase, fileName, exportName, a4, a5, backgroundFilename, backgroundExportname, headerExportName, a9);

            if (!Constants.POPUPBASE_PATCH_DISALLOWED_REPLACEMENTS.includes(exportName.fromsc())) {
                try {
                    const bgMovieClip = PopupBase.getBackgroundMovieClip(instance);
                    if (bgMovieClip != null) {
                        if (Configuration.useLegacyThemeMode)
                            HomeScreen.setLegacyTheme(bgMovieClip);

                        if (Configuration.darkTheme)
                            bgMovieClip.visibility = !Configuration.darkTheme;
                    }
                } catch (e) { }
            }

            if (exportName.fromsc() == "about_screen" && !Configuration.darkTheme) {
                const gene = ResourceManager.getMovieClip(Resources.EMOJI, "emoji_gene_evil");
                gene.setScale(5);
                gene.setXY(350, 0);
                gene.playOnce();

                const geneMake = ResourceManager.getMovieClip(Resources.EMOJI, "emoji_gene_make");
                geneMake.setScale(5);
                geneMake.setXY(-350, 0);
                geneMake.playOnce();

                const customBgScreenCenter = ResourceManager.getMovieClip('sc/ui.sc', 'custom_bg_screen_center');
                const skinCategoryBg = customBgScreenCenter.getChildByName("skin_category_bg");
                const frameIndex = skinCategoryBg.getFrameIndex("offer_bgr_hackers");
                skinCategoryBg.gotoAndStopFrameIndex(frameIndex);

                Sprite.addChildAt(popupBase, skinCategoryBg, 0);

                DropGUIContainer.getMovieClip(popupBase).addChild(gene);
                DropGUIContainer.getMovieClip(popupBase).addChild(geneMake);
            }

            return popupBase;
        }, 'pointer', ['pointer', 'pointer', 'pointer', 'bool', 'bool', 'pointer', 'pointer', 'pointer', 'pointer']));
    }
}
