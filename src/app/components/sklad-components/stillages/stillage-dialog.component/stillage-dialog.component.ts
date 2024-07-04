import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { CellAnswModel } from "../../../../models/map-models/cell-answ";
import { MatTableDataSource } from "@angular/material/table";
import { TokenService } from "../../../../services/token.service";
import { MapService } from "../../../../services/map.service";
import { SnackbarService } from "../../../../services/snackbar.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TokenModel } from "../../../../models/token";

export interface DialogData {
    cell: string;
    stillage: string,
    floor: string,
    num: string
}

export class DetailCell {
    constructor(
        public num: number,
        public article: string,
        public barcode: string,
        public name: string,
        public count: string,
    ) { }
}

@Component({
    selector: 'app-stillage-dialog',
    templateUrl: './stillage-dialog.component.html',
    styleUrl: './stillage-dialog.component.scss'
})
export class StillageDialogComponent implements OnInit {
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    dataCell: CellAnswModel;
    detailCell: Array<DetailCell> = [];
    dataSource: MatTableDataSource<DetailCell>;
    displayedColumns: Array<string> = ['num', 'article', 'barcode', 'name', 'count'];

    messageNoConnect = 'Нет соединения, попробуйте позже.';
    messageWrongCell = 'Ошибка сервера';
    action = 'Ok';
    styleNoConnect = 'red-snackbar';

    constructor(
        private tokenService: TokenService,
        private wmsMapService: MapService,
        private snackbarService: SnackbarService,
        public dialogRef: MatDialogRef<StillageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    ngOnInit() {
        if (this.data) {
            this.wmsMapService.GetCell(new TokenModel(this.tokenService.getToken(), this.data.cell)).subscribe({
                next: responce => {
                    if (responce) {
                        this.dataCell = responce;
                        if (this.dataCell.cell === this.data.cell) {
                            let i = 1;
                            this.detailCell = this.dataCell.body.map(item => ({
                                num: i++,
                                article: item.article,
                                barcode: item.barcode,
                                name: item.name,
                                count: item.count + ' ' + (item.mesabbrev != null ? item.mesabbrev : ''),
                                // count: 12345678910 + ' ' + (item.mesabbrev != null ? item.mesabbrev: ''),
                            }));
                            this.dataSource = new MatTableDataSource(this.detailCell);
                            this.dataSource.sort = this.sort;
                        } else {
                            this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
                            this.onNoClick();
                        }
                    }
                },
                error: error => {
                    console.log(error);
                    this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
                }
            });
        }
    }

    onOkClick(): void {
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}