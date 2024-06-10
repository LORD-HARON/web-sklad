export class FindInfoAnswModel {
    constructor(
        public article: string,
        public barcode: string,
        public name: string,
        public edism: string,
        public quantity: string,
        public price: string,
        public srSut: string,
        public img_url: string,
        public link: string
    ) { }
}