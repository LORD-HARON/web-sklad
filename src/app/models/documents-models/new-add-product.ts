export class NewAddProductModel {
    constructor(
        public token: string,
        public storeLoc: string,
        public docId: number,
        public article: string,
        public barcode: string,
        public name: string,
        public places: PlacesModel[],
        public numb: number,
        public price: string,
        public imgURL: string,
        public otherPosition: boolean,
        public ukz: string
    ) { }
}

export class PlacesModel {
    constructor(
        public id: number,
        public cell: string,
        public count_e: number,
        public count_s: number
    ) { }
}