export class HistDataModel {
    constructor(
        public article: string,
        public barcode: string,
        public name: string,
        public count: string,
        public place: string,
        public doc_name: string,
        public doc_type: string,
        public doc_who: string,
        public doc_date: string,
        public doc_state: string,
    ) { }
}
export class HistAnswModel {
    constructor(
        public histData: HistDataModel[]
    ) { }
}