import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TaskCommonService } from "../../../../services/task-common.service";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from "@angular/material/chips";
import { DocListComponent } from "../task-dialog/doc-list/doc-list.component";
export class ListItem {
    constructor(
        public title: string,
        public item: string,
    ) { }
}
@Component({
    selector: 'app-base-form',
    templateUrl: './base-form.component.html',
    styleUrl: './base-form.component.scss'
})
export class BaseFormComponent implements OnInit {

    @Output() onDataSelected: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

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

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    list: Array<string> = [];
    listItem: Array<ListItem> = [];

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.list.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.onDataSelected.emit(this.list);
    }

    remove(doc: string): void {
        const index = this.list.indexOf(doc);
        if (index >= 0) {
            this.list.splice(index, 1);
        }
        this.listItem = this.listItem.filter(item => item.item !== doc);
    }

    openDocList() {
        const dialogRef = this.dialog.open(DocListComponent, {
            width: '80vw',
            height: '85vh',
            data: { list: this.listItem },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.listItem = result;
                this.list = [];
                this.listItem.forEach(element => {
                    this.list = this.list.concat(element.item);
                });
                this.onDataSelected.emit(this.list);
            }
        });
    }

    onClear() {
        this.listItem = [];
        this.list = [];
    }
}