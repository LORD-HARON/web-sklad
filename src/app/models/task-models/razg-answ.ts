import { NPCBodyModel } from "./npc-body";
import { ProblemListModel } from "./problem-list";
import { ZPCBodyModel } from "./zpc-body";

export class RazgAnswModel {
    constructor(
        public completely: string[],
        public completelyCount: number,
        public partially: string[],
        public notSent: string[],
        public notSetCount: number,
        public badSent: ProblemListModel[],
        public NPCList: NPCBodyModel[],
        public ZPCList: ZPCBodyModel[]
    ) { }
}