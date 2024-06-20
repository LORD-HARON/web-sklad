export class NewTaskModel {
    constructor(
        public token: string,
        public process: ProcessModel[],
        public baseList: string[],
        public executor: ExecutorTaskModel,
        public method: string
    ) { }
}

export class ProcessModel {
    constructor(
        public type: string,
        public zone: string[]
    ) { }
}

export class ExecutorTaskModel {
    constructor(
        public type: string,
        public name: string
    ) { }
}
