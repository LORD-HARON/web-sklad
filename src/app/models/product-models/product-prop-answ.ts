export class ProductPropAnswModel {
    constructor(
        public article: string,
        public type: string,
        public country: string,
        public name: string,
        public mesabbrev: string,
        public group: string,
        public place: string[],
        public delivers: string[]
    ) { }
}