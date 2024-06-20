export class JournalModel {
    constructor(
        public id: number,
        public article: string,
        public place: string,
        public count_e: string,
        public err_msg: string,
        public date_msg: Date
    ) { }
}