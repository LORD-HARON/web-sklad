import { Component, Inject, OnInit } from "@angular/core";
import { ProcService } from "../../../../../services/proc.service";
import { SnackbarService } from "../../../../../services/snackbar.service";
import { TaskCommonService } from "../../../../../services/task-common.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NewTaskModel } from "../../../../../models/task-models/new-task";
import { TaskService } from "../../../../../services/task.service";
import { Status } from "../../../../../models/status";

export interface DataDialog {
    task: NewTaskModel,
}


@Component({
    selector: 'app-confirmation-new-task',
    templateUrl: './confirmation-new-task.component.html',
    styleUrl: './confirmation-new-task.component.scss'
})
export class ConfirmationNewTaskFormComponent implements OnInit {

    messageNoConnect = 'Нет соединения, попробуйте позже.';
    messageTrue = 'Задание создано';
    action = 'Ok';
    styleNoConnect = 'red-snackbar';

    constructor(
        private procService: ProcService,
        private taskService: TaskService,
        private snackbarService: SnackbarService,
        private taskCommonService: TaskCommonService,
        public dialogRef: MatDialogRef<ConfirmationNewTaskFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    ) { }

    ngOnInit() {
        this.data.task;
    }

    onCreate() {
        this.taskService.NewTask(this.data.task).subscribe({
            next: response => {
                this.checkResponse(response);
            },
            error: error => {
                console.log(error);
                this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
            }
        });
    }

    checkResponse(response: Status) {
        if (response.status === 'ok') {
            this.update();
            this.snackbarService.openSnackBar(this.messageTrue, this.action);
            this.dialogRef.close(true);
        }
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    update() {
        this.taskCommonService.updateEvent('update');
    }
}
