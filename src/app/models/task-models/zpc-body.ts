import { AnyBodyModel } from "./any-body";

export class ZPCBodyModel {
    constructor(
        public zpC_NAME: string,
        public anY_DATA1: string,
        public anY_DATA2: string,
        public anY_DATA3: string,
        public body: AnyBodyModel[],
        public style?: string,
    ) { }
}