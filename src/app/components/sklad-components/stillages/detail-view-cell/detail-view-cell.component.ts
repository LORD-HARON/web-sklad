import { Component, Inject, OnInit } from "@angular/core";
import { StillageItemModel } from "../../../../models/map-models/stillage-item";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface DialogData {
    cell: string;
    stillage: string,
    floor: string,
    num: string
}

@Component({
    selector: 'app-detail-view-cell',
    templateUrl: './detail-view-cell.component.html',
    styleUrl: './detail-view-cell.component.scss'
})
export class DetailViewCellComponent implements OnInit {

    stillageItem: StillageItemModel;

    constructor(
        public dialogRef: MatDialogRef<DetailViewCellComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    ngOnInit() {
        if (this.data) {
        }
    }

    onOkClick(): void {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}