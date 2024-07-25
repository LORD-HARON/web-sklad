import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { InventoryItemModel } from "../../../../models/map-models/inventory-item";

export interface DialogData {
    list: Array<InventoryItemModel>;
}
@Component({
    selector: 'app-inventory-dialog',
    templateUrl: './inventory-dialog.component.html',
    styleUrl: './inventory-dialog.component.scss'
})
export class InventoryDialogFormComponent implements OnInit {
    list = [];

    constructor(
        public dialogRef: MatDialogRef<InventoryDialogFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    ngOnInit() {
        let list = this.data;
    }

    onOkClick() {
        this.dialogRef.close(true);
    }

    onNoClick(): void {
        this.dialogRef.close(true);
    }
}