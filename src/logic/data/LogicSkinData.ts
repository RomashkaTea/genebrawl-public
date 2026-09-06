import {LogicData} from "./LogicData";


export class LogicSkinData extends LogicData {
    constructor(instance: NativePointer) {
        super(instance);
    }

    public getDataByOffset(offset: number) {
        return new LogicData(this.instance.add(offset).readPointer());
    }
}
