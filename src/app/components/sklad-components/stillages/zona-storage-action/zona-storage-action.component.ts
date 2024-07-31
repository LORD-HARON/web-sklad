import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { StillageItemModel } from "../../../../models/map-models/stillage-item";
import { CellItemBoolean } from "../../../../models/map-models/cell-item-boolean";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { StillageService } from "../../../../services/stillage.service";
import { StillageDialogComponent } from "../stillage-dialog.component/stillage-dialog.component";

@Component({
    selector: 'app-zona-storage-action',
    templateUrl: './zona-storage-action.component.html',
    styleUrl: './zona-storage-action.component.scss'
})
export class ZonaStorageActionComponent implements OnInit {

    @Input() data: StillageItemModel;
    @Output() listChange = new EventEmitter<string>();

    cellup: string = '';
    celldown: string = '';
    selItem: CellItemBoolean = new CellItemBoolean(false, false, false, false, false, false, false, false, false, false, false, false, false, false, false);
    stillageItem: StillageItemModel;
    selectCellFrom = '';
    selectCellTo = '';
    isSelectCellFrom = false;
    isSelectCellTo = false;
    listSelected: Array<string> = [];
    cellSelected: string = '';
    countClick: number;
    nameCell: string = '';

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private stillageService: StillageService,
    ) {
        this.stillageService.events$.forEach(event => {
            console.log(event);
            this.listenEvent(event);
        });
        this.stillageService.events_click$.forEach(event => {
            console.log(event + ' - rotation');
            this.listenEventClick(event);
        });
    }

    ngOnInit() {
        if (this.data) {
            this.stillageItem = this.data;
            let str = this.data.stillageName.split(';');
            this.cellup = str[0];
            this.celldown = str[1];
        }
    }

    onClickCell(number: string) {
        if (number === '1') {
            this.nameCell = this.cellup;
        } else {
            this.nameCell = this.celldown;
        }
        let zona = this.data.stillageName.split('-')[0];
        if (this.router.url === '/service/map' || this.router.url === '/tsd/mini-map') {
            this.onOpenDetailWindow(this.nameCell, zona, '1', number)
        } else {
            this.getCellItem('1', number);
            this.listChange.emit(this.nameCell);
        }

    }

    onOpenDetailWindow(cell: string, stillage: string, floor: string, number: string,) {
        const dialogRef = this.dialog.open(StillageDialogComponent, {
            data: { cell: cell, stillage: stillage, floor: floor, num: number },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        });
    }

    listenEvent(event: Array<string>) {
        if (this.stillageItem.stillageName === event[0]) {
            this.getCellItem(event[1], event[2]);
        }
    }

    listenEventClick(event: number) {
        this.countClick = event;
        this.stillageItem.stillageName;
    }

    getCellItem(floor: any, number: any) {
        if (floor + number === '11')
            this.selItem.c11 = !this.selItem.c11;

        if (floor + number === '12')
            this.selItem.c12 = !this.selItem.c12;
    }
}
