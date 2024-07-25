export class WhoSendDocChangeModel {
    constructor(
        public token: string,
        public docId: number,
        public whoSend: string
    ) { }
}