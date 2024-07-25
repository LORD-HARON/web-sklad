export class PrintComplateRequestModel {
    constructor(
        public token: string,
        public docName: string,
        public worker: string,
        public dateTo: string,
        public dateFrom: string
    ) { }
}