import { CurrentTaskModel } from "./current-task";

export class MainTaskModel {
    constructor(
        public iD: string,
        public order_status: string,
        public order_base: string,
        public order_prog: string,
        public order_date: string,
        public curTaskList: CurrentTaskModel[]
    ) { }
}