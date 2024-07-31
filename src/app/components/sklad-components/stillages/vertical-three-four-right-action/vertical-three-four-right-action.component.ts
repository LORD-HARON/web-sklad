import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { StillageItemModel } from "../../../../models/map-models/stillage-item";
import { CellItemBoolean } from "../../../../models/map-models/cell-item-boolean";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { StillageService } from "../../../../services/stillage.service";
import { StillageDialogComponent } from "../stillage-dialog.component/stillage-dialog.component";

@Component({
    selector: 'app-vertical-three-four-right-action',
    templateUrl: './vertical-three-four-right-action.component.html',
    styleUrl: './vertical-three-four-right-action.component.scss'
})
export class VerticalThreeFourRightActionComponent implements OnInit {

    @Input() data: any;
    @Output() listChange = new EventEmitter<string>();

    stillageItem: StillageItemModel;
    selectCellFrom = '';
    selectCellTo = '';
    isSelectCellFrom = false;
    isSelectCellTo = false;
    selItem: CellItemBoolean = new CellItemBoolean(false, false, false, false, false, false, false, false, false, false, false, false, false, false, false);
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
        this.listSelected = [];
        if (this.data)
            this.stillageItem = this.data;
    }

    onClickCell(floor: string, number: string) {
        console.log(floor + ':' + number);

        if (this.stillageItem.stillageName) {
            this.nameCell = this.stillageItem.stillageName + '-' + floor + '-' + number;
            if (this.router.url === '/service/map' || this.router.url === '/tsd/mini-map') {
                this.onOpenDetailWindow(this.nameCell, this.stillageItem.stillageName, floor, number)
            } else {
                this.getCellItem(number, floor);
                this.listChange.emit(this.stillageItem.stillageName + '-' + floor + '-' + number);
            }
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
        if (floor + number === '21')
            this.selItem.c21 = !this.selItem.c21;
        if (floor + number === '31')
            this.selItem.c31 = !this.selItem.c31;
        if (floor + number === '41')
            this.selItem.c41 = !this.selItem.c41;
        if (floor + number === '51')
            this.selItem.c51 = !this.selItem.c51;

        if (floor + number === '12')
            this.selItem.c12 = !this.selItem.c12;
        if (floor + number === '22')
            this.selItem.c22 = !this.selItem.c22;
        if (floor + number === '32')
            this.selItem.c32 = !this.selItem.c32;
        if (floor + number === '42')
            this.selItem.c42 = !this.selItem.c42;
        if (floor + number === '52')
            this.selItem.c52 = !this.selItem.c52;

        if (floor + number === '13')
            this.selItem.c13 = !this.selItem.c13;
        if (floor + number === '23')
            this.selItem.c23 = !this.selItem.c23;
        if (floor + number === '33')
            this.selItem.c33 = !this.selItem.c33;
        if (floor + number === '43')
            this.selItem.c43 = !this.selItem.c43;
        if (floor + number === '53')
            this.selItem.c53 = !this.selItem.c53;
    }
}