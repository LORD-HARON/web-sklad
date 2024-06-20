export class CellAnswModel {
    constructor(
        public cell: string,
        public body: CellBodyModel[]
    ) { }
}

export class CellBodyModel {
    constructor(
        public article: string,
        public barcode: string,
        public name: string,
        public count: string,
        public mesabbrev: string
    ) { }
}