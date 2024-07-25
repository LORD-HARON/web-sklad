import { StillageItemModel } from "./stillage-item";

export class InventoryItemModel {
    constructor(
        public stillageItem: StillageItemModel,
        public name: string
    ) { }
}