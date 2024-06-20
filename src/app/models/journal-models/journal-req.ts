export class JournalReqModel {
    constructor(
        public token: string,
        public from_data: string,
        public to_date: string
    ) { }
}