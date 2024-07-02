export class ProblemListModel {
    constructor(
        public doc_num: string,
        public article: string,
        public name: string,
        public count: string,
        public mesabberv: string,
        public ost_main: string,
        public ost_braq: string,
        public count_export: string,
        public place: string[]
    ) { }
}