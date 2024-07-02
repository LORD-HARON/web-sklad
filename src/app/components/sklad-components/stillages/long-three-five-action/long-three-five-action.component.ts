import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { StillageItemModel } from "../../../../models/map-models/stillage-item";
import { StillageService } from "../../../../services/stillage.service";

export class Item {
    constructor(
        public c11: boolean,
        public c21: boolean,
        public c31: boolean,
        public c41: boolean,
        public c51: boolean,

        public c12: boolean,
        public c22: boolean,
        public c32: boolean,
        public c42: boolean,
        public c52: boolean,

        public c13: boolean,
        public c23: boolean,
        public c33: boolean,
        public c43: boolean,
        public c53: boolean,
    ) { }
}
@Component({
    selector: 'app-long-three-five-action',
    templateUrl: './long-three-five-action.component.html',
    styleUrl: './long-three-five-action.component.scss'
})

export class LongThreeFiveActionComponent implements OnInit {
    @Input() data: any;
    @Output() listChange = new EventEmitter<string>();

    stillageItem: StillageItemModel;
    selectCellFrom = '';
    selectCellTo = '';
    isSelectCellFrom = false;
    isSelectCellTo = false;
    selItem: Item = new Item(false, false, false, false, false, false, false, false, false, false, false, false, false, false, false);
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
            if (this.router.url === '/map') {
                this.onOpenDetailWindow(this.nameCell, this.stillageItem.stillageName, floor, number)
            } else {
                this.getCellItem(number, floor);
                this.listChange.emit(this.nameCell);
            }
        }
    }

    onOpenDetailWindow(cell: string, stillage: string, floor: string, number: string,) {
        // const dialogRef = this.dialog.open(StillgeDialogFormComponent, {
        //     data: { cell: cell, stillage: stillage, floor: floor, num: number },
        // });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //     }
        // });
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

    getCellItem(numberCell: any, floorCell: any) {
        if (numberCell + floorCell === '51')
            this.selItem.c51 = !this.selItem.c51;
        if (numberCell + floorCell === '52')
            this.selItem.c52 = !this.selItem.c52;
        if (numberCell + floorCell === '53')
            this.selItem.c53 = !this.selItem.c53;
        if (numberCell + floorCell === '41')
            this.selItem.c41 = !this.selItem.c41;
        if (numberCell + floorCell === '42')
            this.selItem.c42 = !this.selItem.c42;
        if (numberCell + floorCell === '43')
            this.selItem.c43 = !this.selItem.c43;
        if (numberCell + floorCell === '31')
            this.selItem.c31 = !this.selItem.c31;
        if (numberCell + floorCell === '32')
            this.selItem.c32 = !this.selItem.c32;
        if (numberCell + floorCell === '33')
            this.selItem.c33 = !this.selItem.c33;
        if (numberCell + floorCell === '21')
            this.selItem.c21 = !this.selItem.c21;
        if (numberCell + floorCell === '22')
            this.selItem.c22 = !this.selItem.c22;
        if (numberCell + floorCell === '23')
            this.selItem.c23 = !this.selItem.c23;
        if (numberCell + floorCell === '11')
            this.selItem.c11 = !this.selItem.c11;
        if (numberCell + floorCell === '12')
            this.selItem.c12 = !this.selItem.c12;
        if (numberCell + floorCell === '13')
            this.selItem.c13 = !this.selItem.c13;
    }
}