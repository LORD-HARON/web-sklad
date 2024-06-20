export class DocumentsListModel {
    constructor(
        public id: number,
        public doc_name?: string,
        public whoset?: string,
        public doc_type?: string,
        public doc_key?: string,
        public doc_env?: string,
        public doc_date: Date = new Date(),
        public motiv?: string,
        public doc_state?: string,
        public token?: string,
        public rotation?: string,
    ) { }
}