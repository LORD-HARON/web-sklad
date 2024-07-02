import { CellItemModel } from "./cell-item";
export class StillageItemModel {
    constructor(
        public y: number,
        public x: number,
        // имя стеллажа
        public stillageName: string,
        // имя ряда
        public rowName: string,
        public cellName: string,
        // тип стеллажа
        public element: string,
        public style: string,
        // начало ряда
        public imageUrl: string,
        public yxName: string,
        public isIt: boolean,
        public isVer: boolean,
        public isHor: boolean,
        public isBusy: boolean,
        public isBraceHor: boolean,
        public isBraceVer: boolean,
        public isStillageRowWithOutNameVer: boolean,
        public isStillageRowWithOutNameHor: boolean,
        public isStillageOneWithName: boolean,
        public isStillageOneWithOutName: boolean,
        public isSelectCellStillage: boolean,
        // ячейки
        public cells: CellItemModel,
    ) { }
}