import { CurrentTaskItemModel } from "./current-task-item";

export class CurrentTaskModel {
    constructor(
        public id: string,
        public order_process: string,
        public order_base: string,
        public order_candoit: string,
        public order_method: string,
        public order_place: string,
        public order_status: string,
        public order_datetime: string,
        public order_user: string,
        public order_start: string,
        public order_end: string,
        public order_prog: string,
        public order_main: string,
        public items: CurrentTaskItemModel[]
    ) { }
}