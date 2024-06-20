export class ProductQueryModel {
    constructor(
        public token: string,
        public group: string,
        public article: string,
        public name: string,
        public barcode: string,
        public place: string,
        public delivery: string,
        public current: string
    ) { }
}