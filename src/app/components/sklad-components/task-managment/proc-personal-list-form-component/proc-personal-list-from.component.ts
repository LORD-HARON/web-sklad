import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ExecutorTaskModel } from "../../../../models/task-models/new-task";
import { TaskCommonService } from "../../../../services/task-common.service";
import { MatDialog } from "@angular/material/dialog";
import { SelectUserFormComponent } from "../task-dialog/select-user-form/select-user-form.component";
import { PersonalListFormComponent } from "../../porsonal-menegment-component/personal-list-form/personal-list-form.component";

@Component({
    selector: 'app-proc-personal-list-form',
    templateUrl: './proc-personal-list-from.component.html',
    styleUrl: './proc-personal-list-from.component.scss'
})
export class ProcPersonalListFormComponent implements OnInit {

    @Output() onDataSelected: EventEmitter<ExecutorTaskModel> = new EventEmitter<ExecutorTaskModel>();

    listWorkers: Array<string> = [];
    displayedColumnsWorkers = ['worker', 'action'];
    isSelectedElement = false;
    selectedMethod: any = 'all';

    constructor(
        public dialog: MatDialog,
        private taskCommonService: TaskCommonService,
    ) {
        this.taskCommonService.events$.forEach(event => {
            console.log(event);
            if (event === 'clear')
                this.onClear();
        });
    }

    ngOnInit() {
    }

    onClickPublic() {
        this.listWorkers = this.listWorkers.concat("Общедоступный");
        this.onDataSelected.emit(new ExecutorTaskModel('all', ''));
        this.isSelectedElement = true;
        this.selectedMethod = '';
    }

    onClear() {
        this.listWorkers = [];
        this.isSelectedElement = false;
        this.selectedMethod = 'all';
    }

    openPersonalListDialog() {
        const dialogRef = this.dialog.open(PersonalListFormComponent, {});
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }

    openSelectGroup() {
        // const dialogRef = this.dialog.open(SelectGroupFormComponent, {
        //     width: '700px',
        //     height: '500px',
        // });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         this.listWorkers = this.listWorkers.concat(result);
        //         this.isSelectedElement = true;
        //         this.onDataSelected.emit(new ExecutorTaskModel('group', this.listWorkers[0]));
        //     }
        // });
        // this.selectedMethod = '';
    }

    openSelectUser() {
        const dialogRef = this.dialog.open(SelectUserFormComponent, {
            width: '700px',
            height: '500px',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.listWorkers = this.listWorkers.concat(result);
                this.isSelectedElement = true;
                this.onDataSelected.emit(new ExecutorTaskModel('user', this.listWorkers[0]));
            }
        });
        this.selectedMethod = '';
    }
}
