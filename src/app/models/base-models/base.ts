export class BaseModel {
    constructor(
        public name: string,
        public article: string,
        public img: string,
        public barcode: string,
        public ready: string,
        public need: string,
        public number: string
    ) { }
}