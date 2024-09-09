export class FindInfoReqModel {
    constructor(
        public article?: string | null,
        public barcode?: string,
        public storeId?: string,
        public priceType?: string,
        public docId?: number
    ) { }
}