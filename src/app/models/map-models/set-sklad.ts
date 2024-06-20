import { StillagesModel } from "./stillages";

export class SetSkladModel {
    constructor(
        public token: string,
        public sklad: StillagesModel
    ) { }
}