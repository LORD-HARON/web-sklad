export class CreateDocumentModel {
    constructor(
        public doc_name: string,
        public who_create: string,
        public doc_type: string,
        public token: string,
    ) { }
}