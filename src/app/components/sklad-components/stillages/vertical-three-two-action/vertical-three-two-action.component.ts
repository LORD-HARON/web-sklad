import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { StillageItemModel } from "../../../../models/map-models/stillage-item";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { StillageService } from "../../../../services/stillage.service";
import { StillageDialogComponent } from "../stillage-dialog.component/stillage-dialog.component";
export class Item {
    constructor(
        public c31: boolean,
        public c32: boolean,
        public c33: boolean,

        public c41: boolean,
        public c42: boolean,
        public c43: boolean,
    ) { }
}

@Component({
    selector: 'app-vertical-three-two-action',
    templateUrl: './vertical-three-two-action.component.html',
    styleUrl: './vertical-three-two-action.component.scss'
})
export class VerticalThreeTwoActionComponent implements OnInit {

    @Input() data: any;
    @Output() listChange = new EventEmitter<string>();

    stillageItem: StillageItemModel;
    selectCellFrom = '';
    selectCellTo = '';
    isSelectCellFrom = false;
    isSelectCellTo = false;
    selItem: Item = new Item(false, false, false, false, false, false);
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
        if (this.stillageItem.stillageName) {
            this.nameCell = this.stillageItem.stillageName + '-' + floor + '-' + number;
            if (this.router.url === '/service/map') {
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
        if (floor + number === '31')
            this.selItem.c31 = !this.selItem.c31;
        if (floor + number === '41')
            this.selItem.c41 = !this.selItem.c41;

        if (floor + number === '32')
            this.selItem.c32 = !this.selItem.c32;
        if (floor + number === '42')
            this.selItem.c42 = !this.selItem.c42;

        if (floor + number === '33')
            this.selItem.c33 = !this.selItem.c33;
        if (floor + number === '43')
            this.selItem.c43 = !this.selItem.c43;
    }
}
