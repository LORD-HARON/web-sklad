export class MotivationQueryModel {
    constructor(
        public token: string,
        public fromDate: string,
        public toDate: string,
        public user: string
    ) { }
}