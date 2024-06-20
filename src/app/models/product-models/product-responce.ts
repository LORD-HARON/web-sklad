export class ProductResponceModel {
    constructor(
        public article: string,
        public name: string,
        public status: string,
        public barcode: string,
        public quantity: string,
        public braquantity: string
    ) { }
}