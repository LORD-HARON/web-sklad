export class SkladUserModel {
    constructor(
        public id: number,
        public login: string,
        public token: string,
        public group: string
    ) { }
}