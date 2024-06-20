import { AnyBodyModel } from "./any-body";

export class NPCBodyModel {
    constructor(
        public NPC_NAME: string,
        public ANY_DATA1: string,
        public ANY_DATA2: string,
        public ANY_DATA3: string,
        public body: AnyBodyModel[]
    ) { }
}