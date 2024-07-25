export class JournalReqModel {
    constructor(
        public token: string,
        public from_date: string,
        public to_date: string
    ) { }
}