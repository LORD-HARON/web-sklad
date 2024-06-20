import { StillageItemModel } from "./Stillage-itame";

export class StillagesModel {
    constructor(
        public stillageItem: Array<Array<StillageItemModel>>,
        public y: number,
        public x: number,
    ) { }
}