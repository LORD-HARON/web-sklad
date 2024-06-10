export class DocumentsListModel {
    constructor(
        public id: number,
        public doc_name?: string,
        public who_create?: string,
        public doc_type?: string,
        public doc_state?: string,
        public token?: String
    ) { }
}