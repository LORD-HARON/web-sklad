import { Component, Input, OnInit } from "@angular/core";
import { StillageItemModel } from "../../../../models/map-models/stillage-item";
import { CellItemBoolean } from "../../../../models/map-models/cell-item-boolean";

@Component({
    selector: 'app-zona-storage',
    templateUrl: './zona-storage.component.html',
    styleUrl: './zona-storage.component.scss'
})
export class ZonaStorageComponent implements OnInit {

    @Input() data: StillageItemModel;
    cellup: string = '';
    celldown: string = '';
    selItem: CellItemBoolean = new CellItemBoolean(false, false, false, false, false, false, false, false, false, false, false, false, false, false, false);

    constructor() { }

    ngOnInit() {
        if (this.data) {
            let str = this.data.stillageName.split(';');
            this.cellup = str[0];
            this.celldown = str[1];
        }
    }

    onClickCell(number: string) {
        let n = number;
    }
}