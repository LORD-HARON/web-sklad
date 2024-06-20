import { SkladUserModel } from "../login-models/sklad-user";

export class UpdateSkladUserModel {
    constructor(
        public token: string,
        public skladUser: SkladUserModel
    ) { }
}