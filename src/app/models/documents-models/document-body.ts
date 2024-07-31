export class DocumentBodyModel {
    constructor(
        public id: number,
        public id_doc: number,
        public article: string,
        public barcode: String,
        public name: string,
        public count_e: string,
        public numb: number,
        public place: string,
        public price?: string,
        public imgUrl?: string,
        public count_s?: string,
    ) { }
}