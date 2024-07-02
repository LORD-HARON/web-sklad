import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { StillageItemModel } from "../../../../models/map-models/stillage-item";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { StillageService } from "../../../../services/stillage.service";
export class Item {
    constructor(
        public c11: boolean,
        public c21: boolean,
        public c31: boolean,

        public c12: boolean,
        public c22: boolean,
        public c32: boolean,
    ) { }
}
@Component({
    selector: 'app-vertical-two-three-action',
    templateUrl: './vertical-two-three-action.component.html',
    styleUrl: './vertical-two-three-action.component.scss'
})
export class VerticalTwoThreeActionComponent implements OnInit {

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
            if (this.router.url === '/map') {
                this.onOpenDetailWindow(this.nameCell, this.stillageItem.stillageName, floor, number)
            } else {
                this.getCellItem(floor, number);
                this.listChange.emit(this.nameCell);
            }
        }
    }

    onOpenDetailWindow(cell: string, stillage: string, floor: string, number: string,) {
        //   const dialogRef = this.dialog.open(StillgeDialogFormComponent, {
        //     data: { cell: cell, stillage: stillage, floor: floor, num: number },
        //   });
        //   dialogRef.afterClosed().subscribe(result => {
        //     if(result) {

        //     }
        //   });
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

        if (floor + number === '12')
            this.selItem.c12 = !this.selItem.c12;
        if (floor + number === '22')
            this.selItem.c22 = !this.selItem.c22;
        if (floor + number === '32')
            this.selItem.c32 = !this.selItem.c32;
    }
}