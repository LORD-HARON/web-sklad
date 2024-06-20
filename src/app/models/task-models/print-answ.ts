import { DocumentBodyModel } from "../documents-models/document-body";

export class PrintAnswModel {
    constructor(
        public docName: string,
        public documentBody: DocumentBodyModel[]
    ) { }
}