import { PlacesModel } from "./new-add-product";

export class DocumentBodyAnswerModel {
    constructor(
        public article: string,
        public barcode: string,
        public name: string,
        public places: PlacesModel[],
        public numb: number,
        public totalCount: number,
        public price: string,
        public imgUrl: string,
        public ukz: string
    ) { }
}