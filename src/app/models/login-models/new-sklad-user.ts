export class NewSkladUserModel {
    constructor(
        public token: string,
        public login: string,
        public group: string
    ) { }
}