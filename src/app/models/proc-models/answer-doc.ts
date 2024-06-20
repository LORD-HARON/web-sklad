export class AnswerDocModel {
    constructor(
        public docId: string,
        public docDate: string,
        public docloc: string,
        public docLabel: string,
        public highLighted: boolean
    ) { }
}