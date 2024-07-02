import { AnyBodyModel } from "./any-body";

export class NPCBodyModel {
    constructor(
        public npC_NAME: string,
        public anY_DATA1: string,
        public anY_DATA2: string,
        public anY_DATA3: string,
        public body: AnyBodyModel[],
        public style?: string,
    ) { }
}