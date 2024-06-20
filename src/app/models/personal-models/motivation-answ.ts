import { MotivationModel } from "./motivation";

export class MotivationAnswModel {
    constructor(
        public login: string,
        public motivation: MotivationModel[]
    ) { }
}