import { StillageItemModel } from "./stillage-item";

export class StillagesModel {
    constructor(
        public stillageItem: Array<Array<StillageItemModel>>,
        public y: number,
        public x: number,
    ) { }
}