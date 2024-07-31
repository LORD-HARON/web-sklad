export class PrintComplateRequestModel {
    constructor(
        public token: string,
        public docName: string,
        public worker: string,
        public dateFrom: string,
        public dateTo: string,

    ) { }
}