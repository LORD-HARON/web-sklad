import { SkladUserModel } from "./sklad-user";

export class UpdateSkladUserModel {
    constructor(
        public token: string,
        public skladUser: SkladUserModel
    ) { }
}