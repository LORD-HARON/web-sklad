export class AddProductModel {
    constructor(
        public token: string,
        public storeLoc: string,
        public docId: number,
        public article: string,
        public barcode: string,
        public name: string,
        public count_e: number,
        public place: string,
        public numb: number,
        public price: string,
        public imgURL: string
    ) { }
}