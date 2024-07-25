import { Component, Inject, OnInit } from "@angular/core";
import { StillageItemModel } from "../../../../models/map-models/stillage-item";
import { TokenService } from "../../../../services/token.service";
import { MapService } from "../../../../services/map.service";
import { TokenModel } from "../../../../models/token";
import { SnackbarService } from "../../../../services/snackbar.service";
import { StillagesModel } from "../../../../models/map-models/stillages";
import { CellItemModel } from "../../../../models/map-models/cell-item";
import { SetSkladModel } from "../../../../models/map-models/set-sklad";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

const HEIGHT_MAP = 16;
const WIDTH_MAP = 17;

export interface State {
    name: string;
}

@Component({
    selector: 'app-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrl: './map-editor.component.scss'
})
export class MapEditorComponent implements OnInit {
    tab_map: StillageItemModel[][] = [];
    previous_tab_map: StillageItemModel[][] = [];
    temp_arr: StillageItemModel[][] = [];
    array_name: string[] = [];
    currentCell: StillageItemModel
    previousCell: StillageItemModel
    firstCell: StillageItemModel | null
    y_height: number = 0;
    x_width: number = 0;
    stillageRowName: string = '';
    stillageName: string = '';
    zoneName: string = '';
    longName: string = '';
    zoneSendName: string = '';
    imageUrlHor1: string = '../assets/brace-hor.png'
    imageUrlVer1: string = '../assets/brace-ver.png'
    selectedElement1: any = 'undefined';
    selectedElement2: any = 'undefined';
    selectedElement3: any = 'undefined';
    selectedElement4: any = 'undefined';
    selectedRow: any = 'undefined';
    selectedEditor: any = 'undefined';
    confirmText: string = 'Да';
    cancelText: string = 'Нет';
    isChoiceStillage = false;
    isChoiceZoneUnloade = false;
    isChoiceZonaSend = false;
    isChoiceOffice = false;
    isChoiceRoad = false;
    isPanelOpenStillage = false;
    isChoiceProperties = false;
    isSelectTypeRowStillage = false;
    isHor1Stillage = false;
    isHor2Stillage = false;
    isVer1Stillage = false;
    isVer2Stillage = false;
    isChoiceDelete = false;
    isChoiceContinueRow = false;
    isSelectEditor = false;
    isSelectCellStillage = false;
    isChanged = false;
    isSelectCellWithRowName = false;
    isSelectedElement = false;
    isSelectedRowStillages = false;
    isSelectedStillage = false;

    temp_y_first = -1;
    temp_y_second = -1;
    temp_x_first = -1;
    temp_x_second = -1;

    isSelectSize: boolean;

    constructor(
        private tokenService: TokenService,
        private mapService: MapService,
        private snackBarService: SnackbarService,
        private dialog: MatDialog
    ) { }
    ngOnInit(): void {
        this.getSklad()
    }

    getSklad() {
        this.mapService.GetSklad(new TokenModel(this.tokenService.getToken())).subscribe({
            next: result => {
                if (result) {
                    this.checkResponse(result);
                    if (this.isChanged)
                        this.isChanged = !this.isChanged;
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    checkResponse(result: StillagesModel) {
        this.tab_map = result.stillageItem;
        this.y_height = result.y;
        this.x_width = result.x;
        if (this.tab_map) {
            if (this.tab_map.length === 0) {
                this.createNewMap();
            }
        } else {
            this.createNewMap();
        }
        this.cloneMap();
    }
    createNewMap() {
        if (this.y_height === 0)
            this.y_height = HEIGHT_MAP;
        if (this.x_width === 0)
            this.x_width = WIDTH_MAP;
        for (var i: number = 0; i < this.y_height; i++) {
            this.tab_map[i] = [];
            for (var j: number = 0; j < this.x_width; j++) {
                this.tab_map[i][j] = new StillageItemModel(i, j, '', '', '', '', '', '', '', false, false, false, false, false, false, false, false, false, false, false, new CellItemModel());
            }
        }
    }
    cloneMap() {
        this.previous_tab_map = this.tab_map.map(obj => ({ ...obj }));
    }

    isItStillage(cell: StillageItemModel) {
        if (cell.element === 'zona-storage-pallet' ||
            cell.element === 'ver-3-4' ||
            cell.element === 'ver-3-4r' ||
            cell.element === 'hor-3-4' ||
            cell.element === 'ver-3-3' ||
            cell.element === 'ver-3-3r' ||
            cell.element === 'hor-3-3' ||
            cell.element === 'ver-3-2r' ||
            cell.element === 'hor-3-2' ||
            cell.element === 'ver-3-5' ||
            cell.element === 'ver-3-5r' ||
            cell.element === 'hor-3-5' ||
            cell.element === 'ver-2-5' ||
            cell.element === 'ver-2-5r' ||
            cell.element === 'hor-2-5' ||
            cell.element === 'ver-2-4' ||
            cell.element === 'ver-2-4r' ||
            cell.element === 'hor-2-4' ||
            cell.element === 'long-3-1-5' ||
            cell.element === 'long-2-3-4' ||
            cell.element === 'long-3-5' ||
            cell.element === 'long-3-4' ||
            cell.element === 'ver-2-3') {
            return true;
        } else {
            return false;
        }
    }
    calculateAllCells() {
        let count = 0;
        this.tab_map.forEach(element => {
            element.forEach(element => {

                if (element.element === 'ver-3-4') {
                    count += 12;
                }
                if (element.element === 'ver-3-4r') {
                    count += 12;
                }
                if (element.element === 'ver-3-3') {
                    count += 9;
                }
                if (element.element === 'ver-3-3r') {
                    count += 9;
                }
                if (element.element === 'ver-3-2') {
                    count += 6;
                }
                if (element.element === 'ver-3-2r') {
                    count += 6;
                }
                if (element.element === 'ver-3-5') {
                    count += 15;
                }
                if (element.element === 'ver-3-5r') {
                    count += 15;
                }
                if (element.element === 'ver-2-5') {
                    count += 10;
                }
                if (element.element === 'ver-2-5r') {
                    count += 10;
                }
                if (element.element === 'ver-2-4') {
                    count += 8;
                }
                if (element.element === 'ver-2-4r') {
                    count += 8;
                }
                if (element.element === 'long-3-1-5') {
                    count += 7;
                }
                if (element.element === 'long-2-3-4') {
                    count += 8;
                }
                if (element.element === 'long-3-5') {
                    count += 15;
                }
                if (element.element === 'long-3-4') {
                    count += 12;
                }
                if (element.element === 'ver-2-3') {
                    count += 6;
                }
                if (element.element === 'zona-storage-pallet') {
                    count += 2;
                }
            });
        });
    }

    onChangeSize() {
        this.temp_arr = this.tab_map;
        this.tab_map = [];
        for (var i: number = 0; i < this.y_height; i++) {
            this.tab_map[i] = [];
            for (var j: number = 0; j < this.x_width; j++) {
                this.tab_map[i][j] = new StillageItemModel(i, j, '', '', '', '', '', '', '', false, false, false, false, false, false, false, false, false, false, false, new CellItemModel());
            }
        }
        for (var i: number = 0; i < this.tab_map.length; i++) {
            if (i < this.temp_arr.length)
                for (var j: number = 0; j < this.tab_map[i].length; j++) {
                    if (j < this.temp_arr[i].length)
                        this.tab_map[i][j] = this.temp_arr[i][j];
                }
        }
        this.isChanged = true;
    }
    onSelectCell(cell: StillageItemModel) {
        if (this.isItStillage(cell)) {
            this.isPanelOpenStillage = false
            this.isChoiceProperties = true;
        }
        if (this.previousCell) {
            this.tab_map[this.previousCell.y][this.previousCell.x].isSelectCellStillage = false;
            this.stillageName = '';
        }
        this.whatIsIt(cell);
        if (cell.element) {
            this.toNameZone(cell);
            this.toNameLong(cell);
        }
        if (this.isSelectEditor && this.isChoiceDelete) {
            this.deleteElement(cell);
        }
        if (cell.isStillageOneWithOutName || cell.isStillageOneWithName || this.isItStillage(cell)) {
            this.selectCell(cell);
        }
        if (this.isPanelOpenStillage) {
            this.drawingElement(cell);
        }
        if (this.isSelectTypeRowStillage) {
            this.selectTypeRowStillage(cell);
        }
        if (cell.isBraceHor || cell.isBraceVer) {
            this.isChoiceProperties = true;
            this.stillageRowName = cell.rowName;
        }
    }

    whatIsIt(cell: StillageItemModel) {
        this.isSelectedElement = false;
        this.isSelectedRowStillages = false;
        this.isSelectedStillage = false;
        if (cell.element && !cell.imageUrl) {
            this.currentCell = cell;
            this.isSelectedElement = true;
            this.isSelectedRowStillages = false;
            this.isSelectedStillage = false;
        }
        if ((cell.isBraceHor || cell.isBraceVer) && cell.imageUrl) {
            this.currentCell = cell;
            this.isSelectedElement = false;
            this.isSelectedRowStillages = true;
            this.isSelectedStillage = false;
        }
        if (this.isItStillage(cell)) {
            this.currentCell = cell;
            this.isSelectedElement = false;
            this.isSelectedRowStillages = false;
            this.isSelectedStillage = true;
        }
    }

    selectTypeRowStillage(cell: StillageItemModel) {
        if (!cell.isBusy) {
            if (this.isHor1Stillage) {
                if (!cell.isStillageRowWithOutNameVer && !this.tab_map[cell.y][cell.x + 1].isBusy && !this.tab_map[cell.y][cell.x + 2].isBusy) {
                    cell.imageUrl = this.imageUrlHor1;
                    cell.isBraceHor = true;
                    for (var i: number = 1; i < this.x_width - cell.x - 1; i++) {
                        if (cell.x + i + 1 < this.x_width) {
                            if (this.tab_map[cell.y][cell.x + i + 1].element ||
                                this.tab_map[cell.y][cell.x + i + 1].isStillageRowWithOutNameVer ||
                                this.tab_map[cell.y][cell.x + i + 1].isStillageRowWithOutNameHor ||
                                this.tab_map[cell.y][cell.x + i + 1].isVer ||
                                this.tab_map[cell.y][cell.x + i + 1].isHor ||
                                this.tab_map[cell.y][cell.x + i + 1].isBraceHor ||
                                this.tab_map[cell.y][cell.x + i + 1].isBraceVer) {
                                break;
                            }
                            else {
                                this.tab_map[cell.y][cell.x + i].isStillageRowWithOutNameHor = true;

                                if (cell.y + 2 < this.y_height) {
                                    this.tab_map[cell.y + 2][cell.x + i].isBusy = true;
                                }
                                if (cell.y - 2 >= 0) {
                                    this.tab_map[cell.y - 2][cell.x + i].isBusy = true;
                                }
                                if (cell.y + 1 >= this.y_height) {
                                    this.tab_map[cell.y - 1][cell.x].isBusy = true;
                                    this.tab_map[cell.y - 1][cell.x + i].isBusy = true;
                                }
                                if (cell.y - 1 < 0) {
                                    this.tab_map[cell.y + 1][cell.x].isBusy = true;
                                    this.tab_map[cell.y + 1][cell.x + i].isBusy = true;
                                }
                            }
                        }
                    }
                    this.tab_map[cell.y][cell.x].isBusy = true;
                    if (cell.x - 1 >= 0) {
                        this.tab_map[cell.y][cell.x - 1].isBusy = true;
                        if (cell.y - 1 >= 0) {
                            this.tab_map[cell.y - 1][cell.x - 1].isBusy = true;
                            if (cell.y - 2 >= 0) {
                                this.tab_map[cell.y - 2][cell.x - 1].isBusy = true;
                            }
                        }
                        if (cell.y + 1 < this.y_height) {
                            this.tab_map[cell.y + 1][cell.x - 1].isBusy = true;
                            if (cell.y + 2 < this.y_height) {
                                this.tab_map[cell.y + 2][cell.x - 1].isBusy = true;
                            }
                        }
                        if (cell.x - 2 >= 0) {
                            this.tab_map[cell.y][cell.x - 2].isBusy = true;
                            if (cell.y - 1 >= 0) {
                                this.tab_map[cell.y - 1][cell.x - 2].isBusy = true;
                                if (cell.y - 2 >= 0) {
                                    this.tab_map[cell.y - 2][cell.x - 2].isBusy = true;
                                }
                            }
                            if (cell.y + 1 < this.y_height) {
                                this.tab_map[cell.y + 1][cell.x - 2].isBusy = true;
                                if (cell.y + 2 < this.y_height) {
                                    this.tab_map[cell.y + 2][cell.x - 2].isBusy = true;
                                }
                            }
                        }
                    }
                    if (cell.x + 1 < this.x_width) {
                        this.tab_map[cell.y][cell.x + 1].isBusy = true;
                        if (cell.x + 2 < this.x_width) {
                            this.tab_map[cell.y][cell.x + 2].isBusy = true;
                        }
                    }
                    if (cell.y + 2 < this.y_height) {
                        this.tab_map[cell.y + 2][cell.x].isBusy = true;
                    }
                    if (cell.y - 2 >= 0) {
                        this.tab_map[cell.y - 2][cell.x].isBusy = true;
                    }
                }
            }
            if (this.isVer1Stillage) {
                if (!cell.isStillageRowWithOutNameHor && !this.tab_map[cell.y + 1][cell.x].isBusy && !this.tab_map[cell.y + 2][cell.x].isBusy) {
                    cell.imageUrl = this.imageUrlVer1;
                    cell.isBraceVer = true;
                    for (var i: number = 1; i < this.y_height - cell.y - 1; i++) {
                        if (cell.y + i + 1 < this.y_height) {
                            if (this.tab_map[cell.y + i + 1][cell.x].element ||
                                this.tab_map[cell.y + i + 1][cell.x].isStillageRowWithOutNameVer ||
                                this.tab_map[cell.y + i + 1][cell.x].isStillageRowWithOutNameHor ||
                                this.tab_map[cell.y + i + 1][cell.x].isVer ||
                                this.tab_map[cell.y + i + 1][cell.x].isHor ||
                                this.tab_map[cell.y + i + 1][cell.x].isBraceHor ||
                                this.tab_map[cell.y + i + 1][cell.x].isBraceVer) {
                                break;
                            }
                            else {
                                this.tab_map[cell.y + i][cell.x].isStillageRowWithOutNameVer = true;

                                if (cell.x + 1 < this.x_width) {
                                    if (cell.y - 1 >= 0) {
                                        this.tab_map[cell.y - 1][cell.x + 1].isBusy = true;
                                    }
                                    if (cell.y - 2 >= 0) {
                                        this.tab_map[cell.y - 2][cell.x + 1].isBusy = true;
                                    }
                                }
                                else {
                                    this.tab_map[cell.y][cell.x - 1].isBusy = true;
                                    this.tab_map[cell.y + i][cell.x - 1].isBusy = true;
                                }
                                if (cell.x + 2 < this.x_width) {
                                    this.tab_map[cell.y + i][cell.x + 2].isBusy = true;
                                }
                                if (cell.x - 1 >= 0) {
                                    if (cell.y - 1 >= 0) {
                                        this.tab_map[cell.y - 1][cell.x - 1].isBusy = true;
                                    }
                                    if (cell.y - 2 >= 0) {
                                        this.tab_map[cell.y - 2][cell.x - 1].isBusy = true;
                                    }
                                }
                                else {
                                    this.tab_map[cell.y][cell.x + 1].isBusy = true;
                                    this.tab_map[cell.y + i][cell.x + 1].isBusy = true;
                                }
                                if (cell.x - 2 >= 0) {
                                    this.tab_map[cell.y + i][cell.x - 2].isBusy = true;
                                }
                            }
                        }
                    }
                    this.tab_map[cell.y][cell.x].isBusy = true;
                    if (cell.y - 1 >= 0) {
                        this.tab_map[cell.y - 1][cell.x].isBusy = true;
                        if (cell.x - 2 >= 0) {
                            this.tab_map[cell.y - 1][cell.x - 2].isBusy = true;
                        }
                        if (cell.x + 2 < this.x_width) {
                            this.tab_map[cell.y - 1][cell.x + 2].isBusy = true;
                        }
                        if (cell.y - 2 >= 0) {
                            this.tab_map[cell.y - 2][cell.x].isBusy = true;
                            if (cell.x - 2 >= 0) {
                                this.tab_map[cell.y - 2][cell.x - 2].isBusy = true;
                            }
                            if (cell.x + 2 < this.x_width) {
                                this.tab_map[cell.y - 2][cell.x + 2].isBusy = true;
                            }
                        }
                    }
                    if (cell.y + 1 < this.y_height) {
                        this.tab_map[cell.y + 1][cell.x].isBusy = true;
                        if (cell.y + 1 < this.y_height) {
                            this.tab_map[cell.y + 2][cell.x].isBusy = true;
                        }
                    }
                    if (cell.x - 2 >= 0) {
                        this.tab_map[cell.y][cell.x - 2].isBusy = true;
                    }
                    if (cell.x + 2 <= this.x_width - 1) {
                        this.tab_map[cell.y][cell.x + 2].isBusy = true;
                    }
                }
            }
        }
    }

    drawingElement(cell: StillageItemModel) {
        if (this.isChoiceStillage) {
            this.drawingStillage(cell);
        }
        if (this.selectedElement3 === 'road') {
            this.drawingRoad(cell);
        }
        if (this.selectedElement4 === 'zone_storage') {
            this.drawingZoneStorage(cell);
        }
        if (this.selectedElement3 === 'zone_unload') {
            this.drawingZoneUnload(cell);
        }
        if (this.selectedElement3 === 'zone_send') {
            this.drawingZoneSend(cell);
        }
        if (this.selectedElement3 === 'office') {
            this.drawingOffice(cell);
        }
        if (this.selectedElement3 === 'continueRow') {
            this.drawingContinueRow(cell);
        }
    }
    toNameZone(cell: StillageItemModel) {
        if (cell.element === 'road' && !cell.imageUrl) {
            this.isSelectedElement = true;
        }
        if (cell.element === 'zone_unload' || cell.element === 'zone_send' || cell.element === 'office' || cell.element === 'zone_storage') {
            if (this.isChoiceProperties) {
                if (!cell.yxName) {
                    if (cell.cellName) {
                        this.zoneName = cell.cellName;
                    } else {
                        cell.isSelectCellStillage = true;
                        if (this.temp_y_first === -1 && this.temp_x_first === -1) {
                            this.temp_y_first = cell.y;
                            this.temp_x_first = cell.x;
                        } else {
                            this.temp_y_second = cell.y;
                            this.temp_x_second = cell.x;
                        }
                    }
                } else {
                    if (cell.cellName)
                        this.zoneName = cell.cellName;
                    if (cell.yxName) {
                        var splitted = cell.yxName.split(";");
                        var nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
                        if (nameStillage) {
                            this.zoneName = nameStillage;
                        }
                    }
                }
            }
            this.isSelectedElement = true;
        }
    }

    toNameLong(cell: StillageItemModel) {
        if (cell.element === 'long-3-1-5' ||
            cell.element === 'long-2-3-4' ||
            cell.element === 'long-3-5' ||
            cell.element === 'long-3-4') {
            if (this.isChoiceProperties) {
                this.longName = cell.stillageName;
                if (this.previousCell) {
                    if (this.previousCell.isSelectCellStillage) {
                        this.tab_map[this.previousCell.y][this.previousCell.x].isSelectCellStillage = false;
                    }
                    else {
                        this.previousCell = cell;
                        this.previousCell.isSelectCellStillage = true;
                    }
                } else {
                    this.previousCell = cell;
                    this.previousCell.isSelectCellStillage = true;
                }
            }
            this.isSelectedElement = true;
        }
    }


    drawingStillage(cell: StillageItemModel) {
        if (!cell.isHor && !cell.isVer && !cell.isBraceHor && !cell.isBraceVer)
            if (this.selectedElement1 === 'stellage34') {
                if (cell.isStillageRowWithOutNameHor) {
                    cell.isHor = true;
                    cell.element = 'hor-3-4';
                    cell.isStillageOneWithOutName = true;
                    cell.isBusy = true;
                    this.isChanged = true;
                }
                if (cell.isStillageRowWithOutNameVer) {
                    cell.isVer = true;
                    cell.element = 'ver-3-4';
                    cell.isStillageOneWithOutName = true;
                    cell.isBusy = true;
                    this.isChanged = true;
                }
            }
        if (this.selectedElement1 === 'zona-storage-pallet') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'zona-storage-pallet';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'zona-storage-pallet';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }
        if (this.selectedElement1 === 'stellage25r') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'hor-2-5r';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'ver-2-5r';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }
        if (this.selectedElement2 === 'stellage34r') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'hor-3-4r';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'ver-3-4r';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }
        if (this.selectedElement2 === 'stellage24r') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'hor-2-4r';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'ver-2-4r';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }
        if (this.selectedElement1 === 'stellage33') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'hor-3-3';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'ver-3-3';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }
        if (this.selectedElement1 === 'stellage32') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'hor-3-2';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'ver-3-2';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }
        if (this.selectedElement1 === 'stellage35') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'hor-3-5';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'ver-3-5';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }
        if (this.selectedElement1 === 'stellage35r') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'hor-3-5r';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'ver-3-5r';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }
        if (this.selectedElement2 === 'stellage25') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'hor-2-5';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'ver-2-5';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }
        if (this.selectedElement2 === 'stellage24') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'hor-2-4';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'ver-2-4';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }
        if (this.selectedElement4 === 'stellage23') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'hor-2-3';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'ver-2-3';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }

        if (this.selectedElement4 === 'stellage32r') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'hor-3-2r';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'ver-3-2r';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }

        if (this.selectedElement4 === 'stellage33r') {
            if (cell.isStillageRowWithOutNameHor) {
                cell.isHor = true;
                cell.element = 'hor-3-3r';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
            if (cell.isStillageRowWithOutNameVer) {
                cell.isVer = true;
                cell.element = 'ver-3-3r';
                cell.isStillageOneWithOutName = true;
                cell.isBusy = true;
                this.isChanged = true;
            }
        }
        if (this.selectedElement2 === 'stellagelong315') {
            cell.element = 'long-3-1-5';
            cell.isStillageOneWithOutName = true;
            cell.isBusy = true;
            this.isChanged = true;
        }
        if (this.selectedElement2 === 'stellagelong234') {
            cell.element = 'long-2-3-4';
            cell.isStillageOneWithOutName = true;
            cell.isBusy = true;
            this.isChanged = true;
        }
        if (this.selectedElement4 === 'stellagelong35') {
            cell.element = 'long-3-5';
            cell.isStillageOneWithOutName = true;
            cell.isBusy = true;
            this.isChanged = true;
        }
        if (this.selectedElement4 === 'stellagelong34') {
            cell.element = 'long-3-4';
            cell.isStillageOneWithOutName = true;
            cell.isBusy = true;
            this.isChanged = true;
        }
    }

    drawingRoad(cell: StillageItemModel) {
        if (!cell.isHor && !cell.isVer && !cell.element) {
            cell.element = 'road';
            cell.isBusy = true;
            this.isChanged = true;
        }
    }

    drawingZoneUnload(cell: StillageItemModel) {
        if (!cell.isBusy) {
            cell.element = 'zone_unload';
            cell.isBusy = true;
            this.isChanged = true;
        }
    }

    drawingZoneSend(cell: StillageItemModel) {
        if (!cell.isBusy) {
            cell.element = 'zone_send';
            cell.isBusy = true;
            this.isChanged = true;
        }
    }

    drawingOffice(cell: StillageItemModel) {
        if (!cell.isBusy) {
            cell.element = 'office';
            cell.isBusy = true;
            this.isChanged = true;
        }
    }

    drawingZoneStorage(cell: StillageItemModel) {
        if (!cell.isBusy) {
            cell.element = 'zone_storage';
            cell.isBusy = true;
            this.isChanged = true;
        }
    }

    drawingContinueRow(cell: StillageItemModel) {
        if (!cell.isBusy) {
            cell.element = 'zone_storage';
            cell.isBusy = true;
            this.isChanged = true;
        }
    }

    deleteElement(cell: StillageItemModel) {
        if (cell.element) {
            cell.element = '';
            cell.isSelectCellStillage = false;
            cell.isStillageOneWithName = false;
            cell.isStillageOneWithOutName = false;
            cell.isStillageOneWithOutName = false;
            cell.isStillageRowWithOutNameVer = true;
            cell.isVer = false;
            cell.isHor = false;
            this.deleteStillageName(cell);
        } else {
            cell.element = '';
            cell.style = '';
            cell.rowName = '';
            cell.cellName = '';
            cell.yxName = '';
            cell.imageUrl = '';
            cell.isIt = false;
            cell.isVer = false;
            cell.isHor = false;
            cell.isBusy = false;
            cell.isBraceHor = false;
            cell.isBraceVer = false;
            cell.isStillageRowWithOutNameVer = false;
            cell.isStillageRowWithOutNameHor = false;
            cell.isStillageOneWithName = false;
            cell.isStillageOneWithOutName = false;
            cell.isSelectCellStillage = false;
            this.deleteStillageName(cell);
        }
        this.isChanged = true;
    }

    deleteStillageName(cell: StillageItemModel) {
        if (cell.yxName) {
            var splitted = cell.yxName.split(";");
            var nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
            if (nameStillage) {
                if (this.array_name) {
                    if (this.array_name.includes(nameStillage)) {
                        const index: number = this.array_name.indexOf(nameStillage);
                        if (index !== -1) {
                            this.array_name.splice(index, 1);
                            this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName = '';
                        }
                    }
                }
                this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName = '';
                cell.stillageName = '';
                cell.yxName = '';
            }
        } else {
            cell.stillageName = '';
            cell.element = '';
            cell.rowName = '';
            cell.cellName = '';
        }
    }

    onClickBrace(cell: StillageItemModel) {
        if (this.previousCell) {
            this.tab_map[this.previousCell.y][this.previousCell.x].isSelectCellStillage = false;
        }
        this.isSelectTypeRowStillage = false;
        this.isChoiceProperties = true;
        this.isChoiceStillage = false;
        this.isPanelOpenStillage = false;
        this.currentCell = cell;
        this.isSelectedElement = false;
    }

    onSaveProperty() {
        if (this.stillageRowName.length > 0) {
            if (this.currentCell) {
                this.currentCell.rowName = this.stillageRowName;
                // this.stillageRowName = '';
                this.currentCell.isStillageRowWithOutNameVer = false;
                this.currentCell.isStillageRowWithOutNameHor = false;
                this.isChanged = true;
            }
        }
        if (this.stillageName.length > 0) {
            if (this.currentCell) {
                if (this.currentCell.rowName.length > 0) {
                    if (!this.array_name.includes(this.currentCell.rowName + this.stillageName)) {
                        this.array_name.push(this.currentCell.rowName + this.stillageName);
                        if (this.currentCell.element === 'zona-storage-pallet') {
                            if (!this.currentCell.stillageName)
                                this.tab_map[this.currentCell.y][this.currentCell.x].stillageName = this.currentCell.rowName + this.stillageName;
                            else
                                this.tab_map[this.currentCell.y][this.currentCell.x].stillageName = this.currentCell.stillageName + ';' + this.currentCell.rowName + this.stillageName;
                        } else {
                            this.drawingStillageName();
                            this.tab_map[this.currentCell.y][this.currentCell.x].stillageName = this.currentCell.rowName + this.stillageName;
                        }
                        this.currentCell.isStillageOneWithName = true;
                        this.currentCell.isStillageOneWithOutName = false;
                        this.currentCell.isSelectCellStillage = false;
                        this.stillageName = '';
                        this.isChanged = true;
                    }
                    else
                        this.stillageName = '';
                }
            }
        }
        // this.currentCell = null;
    }

    onSavePropertyZone() {
        if (this.zoneName.length > 0) {
            if (this.temp_y_first !== -1 && this.temp_y_second !== -1 && this.temp_x_first !== -1 && this.temp_x_second !== -1) {
                this.tab_map[this.temp_y_first][this.temp_x_first].cellName = this.zoneName;
                for (var i = 0; i <= this.temp_y_second - this.temp_y_first; i++) {
                    for (var j: number = 0; j <= this.temp_x_second - this.temp_x_first; j++) {
                        if (i === 0 && j === 0) {
                            let e = 9;
                        } else {
                            this.tab_map[this.temp_y_first + i][this.temp_x_first + j].yxName = this.temp_y_first.toString() + ';' + this.temp_x_first.toString();
                        }
                    }
                }
                this.tab_map[this.temp_y_first][this.temp_x_first].isSelectCellStillage = false;
                this.tab_map[this.temp_y_second][this.temp_x_second].isSelectCellStillage = false;

                this.isChanged = true;
            } else {
                if (this.currentCell.cellName) {
                    this.currentCell.cellName = this.zoneName;
                } else {
                    if (this.currentCell.yxName) {
                        var splitted = this.currentCell.yxName.split(";");
                        if (splitted.length > 1) {
                            this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName = this.zoneName;
                        }
                    }
                }
            }
        }
        this.drawingBoardZone('');
        this.temp_y_first = this.temp_y_second = this.temp_x_first = this.temp_x_second = -1;
        this.isChanged = true;
        this.zoneName = '';
        this.onCanselPropertyZone();
    }

    onSavePropertyLong() {
        if (this.longName.length > 0) {
            if (this.currentCell.element === 'long-3-1-5' || this.currentCell.element === 'long-2-3-4' || this.currentCell.element === 'long-3-5' || this.currentCell.element === 'long-3-4') {
                if (this.currentCell.x + 1 < this.x_width) {
                    if (!this.tab_map[this.currentCell.y][this.currentCell.x + 1].isVer &&
                        !this.tab_map[this.currentCell.y][this.currentCell.x + 1].isHor &&
                        !this.tab_map[this.currentCell.y][this.currentCell.x + 1].isStillageRowWithOutNameVer &&
                        !this.tab_map[this.currentCell.y][this.currentCell.x + 1].isStillageRowWithOutNameHor) {
                        this.tab_map[this.currentCell.y][this.currentCell.x].yxName = (this.currentCell.y).toString() + ';' + (this.currentCell.x + 1).toString();
                        this.tab_map[this.currentCell.y][this.currentCell.x + 1].cellName = this.longName;
                        this.tab_map[this.currentCell.y][this.currentCell.x].stillageName = this.longName;
                        this.currentCell.isStillageOneWithOutName = false;
                    }
                    else {
                        if (this.currentCell.x - 1 >= 0) {
                            if (!this.tab_map[this.currentCell.y][this.currentCell.x - 1].isVer &&
                                !this.tab_map[this.currentCell.y][this.currentCell.x - 1].isHor &&
                                !this.tab_map[this.currentCell.y][this.currentCell.x - 1].isStillageRowWithOutNameVer &&
                                !this.tab_map[this.currentCell.y][this.currentCell.x - 1].isStillageRowWithOutNameHor) {
                                this.tab_map[this.currentCell.y][this.currentCell.x].yxName = (this.currentCell.y).toString() + ';' + (this.currentCell.x - 1).toString();
                                this.tab_map[this.currentCell.y][this.currentCell.x - 1].cellName = this.longName;
                                this.tab_map[this.currentCell.y][this.currentCell.x].stillageName = this.longName;
                                this.currentCell.isStillageOneWithOutName = false;
                            }
                        }
                    }
                }
                else {
                    if (this.currentCell.x - 1 >= 0) {
                        if (!this.tab_map[this.currentCell.y][this.currentCell.x - 1].isVer &&
                            !this.tab_map[this.currentCell.y][this.currentCell.x - 1].isHor &&
                            !this.tab_map[this.currentCell.y][this.currentCell.x - 1].isStillageRowWithOutNameVer &&
                            !this.tab_map[this.currentCell.y][this.currentCell.x - 1].isStillageRowWithOutNameHor) {
                            this.tab_map[this.currentCell.y][this.currentCell.x].yxName = (this.currentCell.y).toString() + ';' + (this.currentCell.x - 1).toString();
                            this.tab_map[this.currentCell.y][this.currentCell.x - 1].cellName = this.longName;
                            this.tab_map[this.currentCell.y][this.currentCell.x].stillageName = this.longName;
                            this.currentCell.isStillageOneWithOutName = false;
                        }
                        else {
                            if (this.currentCell.x + 1 < this.x_width) {
                                if (!this.tab_map[this.currentCell.y][this.currentCell.x + 1].isVer &&
                                    !this.tab_map[this.currentCell.y][this.currentCell.x + 1].isHor &&
                                    !this.tab_map[this.currentCell.y][this.currentCell.x + 1].isStillageRowWithOutNameVer &&
                                    !this.tab_map[this.currentCell.y][this.currentCell.x + 1].isStillageRowWithOutNameHor) {
                                    this.tab_map[this.currentCell.y][this.currentCell.x].yxName = (this.currentCell.y).toString() + ';' + (this.currentCell.x + 1).toString();
                                    this.tab_map[this.currentCell.y][this.currentCell.x + 1].cellName = this.longName;
                                    this.tab_map[this.currentCell.y][this.currentCell.x].stillageName = this.longName;
                                    this.currentCell.isStillageOneWithOutName = false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    onCanselPropertyZone() {
        this.temp_y_first = this.temp_y_second = this.temp_x_first = this.temp_x_second = -1;
        this.tab_map.forEach(row => {
            row.forEach(element => {
                element.isSelectCellStillage = false;
            });
        });
    }

    getNameStillageRow(cell: StillageItemModel) {
        if (cell.isVer) {
            for (var i: number = 0; i <= cell.y; i++) {
                if (cell.y - i >= 0) {
                    if (this.tab_map[cell.y - i][cell.x].isBraceVer) {
                        if (this.tab_map[cell.y - i][cell.x].rowName) {
                            this.stillageRowName = this.tab_map[cell.y - i][cell.x].rowName;
                            this.isSelectCellWithRowName = true;
                            break;
                        } else this.isSelectCellWithRowName = false;
                    }
                }
            }
        }
        if (cell.isHor) {
            for (var i: number = 0; i <= cell.x; i++) {
                if (cell.x - i >= 0) {
                    if (this.tab_map[cell.y][cell.x - i].isBraceHor) {
                        if (this.tab_map[cell.y][cell.x - i].rowName) {
                            this.stillageRowName = this.tab_map[cell.y][cell.x - i].rowName;
                            this.isSelectCellWithRowName = true;
                            break;
                        } else this.isSelectCellWithRowName = false;
                    }
                }
            }
        }
        // if( cell.element === 'long-3-1-5' || 
        //     cell.element === 'long-2-3-4' ||
        //     cell.element === 'long-3-5' || 
        //     cell.element === 'long-3-4') {
        //       if(cell.stillageName)
        //         this.isSelectCellWithRowName = true;
        //       else
        //         this.isSelectCellWithRowName = false;
        //     }
    }
    selectCell(cell: StillageItemModel) {
        if (cell.isHor || cell.isVer) {
            if (this.previousCell) {
                this.tab_map[this.previousCell.y][this.previousCell.x].isSelectCellStillage = false;
            }
            this.previousCell = cell;
            this.currentCell = cell;
            cell.isSelectCellStillage = true;
            this.isSelectedElement = false;
            this.isChoiceStillage = false;
            this.isChoiceRoad = false;
            this.getNameStillageRow(cell);
            var splitted = cell.yxName.split(";");
            if (splitted.length > 1) {
                let temp = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
                this.stillageName = temp.replace(cell.rowName, '');
                if (temp) {
                    if (this.array_name.includes(temp)) {
                        const index: number = this.array_name.indexOf(temp);
                        if (index !== -1) {
                            this.array_name.splice(index, 1);
                        }
                    }
                }
            }
        }
    }

    drawingStillageName() {
        if (this.currentCell.isHor) {
            if (this.currentCell.y + 1 < this.y_height) {
                if (!this.tab_map[this.currentCell.y + 1][this.currentCell.x].isVer &&
                    !this.tab_map[this.currentCell.y + 1][this.currentCell.x].isHor &&
                    !this.tab_map[this.currentCell.y + 1][this.currentCell.x].isStillageRowWithOutNameVer &&
                    !this.tab_map[this.currentCell.y + 1][this.currentCell.x].isStillageRowWithOutNameHor) {
                    this.tab_map[this.currentCell.y][this.currentCell.x].yxName = (this.currentCell.y + 1).toString() + ';' + (this.currentCell.x).toString();
                    this.tab_map[this.currentCell.y + 1][this.currentCell.x].cellName = this.currentCell.rowName + this.stillageName;
                }
                else {
                    if (this.currentCell.y - 1 >= 0) {
                        if (!this.tab_map[this.currentCell.y - 1][this.currentCell.x].isVer &&
                            !this.tab_map[this.currentCell.y - 1][this.currentCell.x].isHor &&
                            !this.tab_map[this.currentCell.y - 1][this.currentCell.x].isStillageRowWithOutNameVer &&
                            !this.tab_map[this.currentCell.y - 1][this.currentCell.x].isStillageRowWithOutNameHor) {
                            this.tab_map[this.currentCell.y][this.currentCell.x].yxName = (this.currentCell.y - 1).toString() + ';' + (this.currentCell.x).toString();
                            this.tab_map[this.currentCell.y - 1][this.currentCell.x].cellName = this.currentCell.rowName + this.stillageName;
                        }
                    }
                }
            }
            else {
                if (this.currentCell.y - 1 >= 0) {
                    if (!this.tab_map[this.currentCell.y - 1][this.currentCell.x].isVer &&
                        !this.tab_map[this.currentCell.y - 1][this.currentCell.x].isHor &&
                        !this.tab_map[this.currentCell.y - 1][this.currentCell.x].isStillageRowWithOutNameVer &&
                        !this.tab_map[this.currentCell.y - 1][this.currentCell.x].isStillageRowWithOutNameHor) {
                        this.tab_map[this.currentCell.y][this.currentCell.x].yxName = (this.currentCell.y - 1).toString() + ';' + (this.currentCell.x).toString();
                        this.tab_map[this.currentCell.y - 1][this.currentCell.x].cellName = this.currentCell.rowName + this.stillageName;
                    }
                    else {
                        if (this.currentCell.y + 1 < this.y_height) {
                            if (!this.tab_map[this.currentCell.y + 1][this.currentCell.x].isVer &&
                                !this.tab_map[this.currentCell.y + 1][this.currentCell.x].isHor &&
                                !this.tab_map[this.currentCell.y + 1][this.currentCell.x].isStillageRowWithOutNameVer &&
                                !this.tab_map[this.currentCell.y + 1][this.currentCell.x].isStillageRowWithOutNameHor) {
                                this.tab_map[this.currentCell.y][this.currentCell.x].yxName = (this.currentCell.y + 1).toString() + ';' + (this.currentCell.x).toString();
                                this.tab_map[this.currentCell.y + 1][this.currentCell.x].cellName = this.currentCell.rowName + this.stillageName;
                            }
                        }
                    }
                }
            }
        }
        if (this.currentCell.isVer) {
            if (this.currentCell.x + 1 < this.x_width) {
                if (!this.tab_map[this.currentCell.y][this.currentCell.x + 1].isVer &&
                    !this.tab_map[this.currentCell.y][this.currentCell.x + 1].isHor &&
                    !this.tab_map[this.currentCell.y][this.currentCell.x + 1].isStillageRowWithOutNameVer &&
                    !this.tab_map[this.currentCell.y][this.currentCell.x + 1].isStillageRowWithOutNameHor) {
                    this.tab_map[this.currentCell.y][this.currentCell.x].yxName = (this.currentCell.y).toString() + ';' + (this.currentCell.x + 1).toString();
                    this.tab_map[this.currentCell.y][this.currentCell.x + 1].cellName = this.currentCell.rowName + this.stillageName;
                }
                else {
                    if (this.currentCell.x - 1 >= 0) {
                        if (!this.tab_map[this.currentCell.y][this.currentCell.x - 1].isVer &&
                            !this.tab_map[this.currentCell.y][this.currentCell.x - 1].isHor &&
                            !this.tab_map[this.currentCell.y][this.currentCell.x - 1].isStillageRowWithOutNameVer &&
                            !this.tab_map[this.currentCell.y][this.currentCell.x - 1].isStillageRowWithOutNameHor) {
                            this.tab_map[this.currentCell.y][this.currentCell.x].yxName = (this.currentCell.y).toString() + ';' + (this.currentCell.x - 1).toString();
                            this.tab_map[this.currentCell.y][this.currentCell.x - 1].cellName = this.currentCell.rowName + this.stillageName;
                        }
                    }
                }
            }
            else {
                if (this.currentCell.x - 1 >= 0) {
                    if (!this.tab_map[this.currentCell.y][this.currentCell.x - 1].isVer &&
                        !this.tab_map[this.currentCell.y][this.currentCell.x - 1].isHor &&
                        !this.tab_map[this.currentCell.y][this.currentCell.x - 1].isStillageRowWithOutNameVer &&
                        !this.tab_map[this.currentCell.y][this.currentCell.x - 1].isStillageRowWithOutNameHor) {
                        this.tab_map[this.currentCell.y][this.currentCell.x].yxName = (this.currentCell.y).toString() + ';' + (this.currentCell.x - 1).toString();
                        this.tab_map[this.currentCell.y][this.currentCell.x - 1].cellName = this.currentCell.rowName + this.stillageName;
                    }
                    else {
                        if (this.currentCell.x + 1 < this.x_width) {
                            if (!this.tab_map[this.currentCell.y][this.currentCell.x + 1].isVer &&
                                !this.tab_map[this.currentCell.y][this.currentCell.x + 1].isHor &&
                                !this.tab_map[this.currentCell.y][this.currentCell.x + 1].isStillageRowWithOutNameVer &&
                                !this.tab_map[this.currentCell.y][this.currentCell.x + 1].isStillageRowWithOutNameHor) {
                                this.tab_map[this.currentCell.y][this.currentCell.x].yxName = (this.currentCell.y).toString() + ';' + (this.currentCell.x + 1).toString();
                                this.tab_map[this.currentCell.y][this.currentCell.x + 1].cellName = this.currentCell.rowName + this.stillageName;
                            }
                        }
                    }
                }
            }
        }
        this.isChanged = true;
    }

    onSave() {
        var data = new StillagesModel(this.tab_map, this.tab_map.length, this.tab_map[0].length);
        data.stillageItem.map(item1 => item1.map(item2 =>
            item2.stillageName ? item2.cells = new CellItemModel('green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green') : null))
        this.mapService.SetSklad(new SetSkladModel(this.tokenService.getToken(), data)).subscribe({
            next: response => {
                if (response) {
                    this.isChanged = false;
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        });
    }

    onCancel() {
        this.getSklad()
    }

    drawingBoardZone(element: string) {
        if (this.temp_x_second === this.temp_x_first) {
            this.tab_map[this.temp_y_first][this.temp_x_first].style = 's-left-top-right';
            for (var i = 1; i < this.temp_y_second - this.temp_y_first; i++) {
                this.tab_map[this.temp_y_first + i][this.temp_x_first].style = 's-left-right';
            }
            this.tab_map[this.temp_y_second][this.temp_x_first].style = 's-left-bottom-right';
        }
        if (this.temp_y_second === this.temp_y_first) {
            this.tab_map[this.temp_y_first][this.temp_x_first].style = 's-left-bottom-top';
            for (var i = 1; i < this.temp_x_second - this.temp_x_first; i++) {
                this.tab_map[this.temp_y_first][this.temp_x_first + i].style = 's-bottom-top';
            }
            this.tab_map[this.temp_y_first][this.temp_x_second].style = 's-right-bottom-top';
        }
        if (this.temp_y_second !== this.temp_y_first && this.temp_x_second !== this.temp_x_first) {
            for (var i = 1; i <= this.temp_x_second - this.temp_x_first; i++) {
                if (this.temp_x_first + i + 1 < this.x_width) {
                    if (this.tab_map[this.temp_y_first][this.temp_x_first + i + 1].element) {
                        this.tab_map[this.temp_y_first][this.temp_x_first + i].style = 's-top';
                    } else {
                        this.tab_map[this.temp_y_first][this.temp_x_first + i].style = 's-right-top';
                    }
                } else {
                    this.tab_map[this.temp_y_first][this.temp_x_first + i].style = 's-right-top';
                }
            }
            for (var i = 1; i <= this.temp_y_second - this.temp_y_first; i++) {
                if (this.temp_y_first + i + 1 < this.y_height) {
                    if (this.tab_map[this.temp_y_first + i + 1][this.temp_x_second].element) {
                        this.tab_map[this.temp_y_first + i][this.temp_x_second].style = 's-right';
                    } else {
                        this.tab_map[this.temp_y_first + i][this.temp_x_second].style = 's-right-bottom';
                    }
                } else {
                    this.tab_map[this.temp_y_first + i][this.temp_x_second].style = 's-right-bottom';
                }
            }
            for (var i = 1; i < this.temp_x_second - this.temp_x_first; i++) {
                this.tab_map[this.temp_y_second][this.temp_x_second - i].style = 's-bottom';
            }
            for (var i = 1; i <= this.temp_y_second - this.temp_y_first; i++) {
                if (this.temp_y_second - i - 1 >= 0) {
                    if (this.tab_map[this.temp_y_second - i - 1][this.temp_x_first].element) {
                        this.tab_map[this.temp_y_second - i][this.temp_x_first].style = 's-left';
                    }
                }
            }
            this.tab_map[this.temp_y_first][this.temp_x_first].style = 's-left-top';
            this.tab_map[this.temp_y_first][this.temp_x_second].style = 's-right-top';
            this.tab_map[this.temp_y_second][this.temp_x_second].style = 's-right-bottom';
            this.tab_map[this.temp_y_second][this.temp_x_first].style = 's-left-bottom';
        }
    }


    openActionDialog(mode: string) {
        const dialogRef = this.dialog.open(MapEditorDialogActionComponent, {
            data: mode,
        });
        dialogRef.afterClosed().subscribe(result => {
            switch (result) {
                case 'save':
                    this.onSave()
                    break
                case 'saveCansel':
                    break
                case 'cancel':
                    this.onCancel()
                    break
                case 'noCancel':
                    break
            }
        });
    }
}

@Component({
    templateUrl: './map-editor-dialog-action.component.html',
    styleUrl: './map-editor.component.scss'
})
export class MapEditorDialogActionComponent implements OnInit {
    constructor(
        private dialogRef: MatDialogRef<MapEditorDialogActionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string,
    ) { }
    dialogeMode: string

    ngOnInit(): void {
        this.dialogeMode = this.data
    }
    save() {
        this.dialogRef.close('save')
    }
    saveCansel() {
        this.dialogRef.close('saveCansel')
    }
    Cansel() {
        this.dialogRef.close('cancel')
    }
    noCancel() {
        this.dialogRef.close('noCancel')
    }
}