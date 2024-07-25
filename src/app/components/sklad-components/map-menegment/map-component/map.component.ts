import { Component, OnInit } from "@angular/core";
import { StillageItemModel } from "../../../../models/map-models/stillage-item";
import { InventoryItemModel } from "../../../../models/map-models/inventory-item";
import { MatDialog } from "@angular/material/dialog";
import { TokenService } from "../../../../services/token.service";
import { MapService } from "../../../../services/map.service";
import { TokenModel } from "../../../../models/token";
import { SnackbarService } from "../../../../services/snackbar.service";
import { InventoryDialogFormComponent } from "../inventory-dialog-component/inventory-dialog.component";
import { StillageDialogComponent } from "../../stillages/stillage-dialog.component/stillage-dialog.component";

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
    tab_map: StillageItemModel[][] = [];
    previousStillageFrom: StillageItemModel
    previousStillageTo: StillageItemModel
    listInventory: Array<InventoryItemModel> = [];
    rotationItem: InventoryItemModel
    y_height: number;
    x_width: number;
    ping: number;
    selectedInventory: any = 'underline';
    selectedRotation: any = 'underline';
    cellFrom = '';
    cellTo = '';
    isSelectInventory = true;
    isFromTo = false;

    isChoiceRow: any;
    isChoiceCell: any;
    isChoiceFrom: any;
    isSelectRotation: any;
    isChoiceTo: any;
    isSelectView: any;
    isSelectTypeRowStillage: any;
    isSelectEditor: any;

    constructor(
        public dialog: MatDialog,
        private tokenService: TokenService,
        private mapService: MapService,
        private snackBarService: SnackbarService
    ) { }
    ngOnInit(): void {
        this.mapService.GetSklad(new TokenModel(this.tokenService.getToken())).subscribe({
            next: result => {
                if (result) {
                    this.tab_map = result.stillageItem;
                    this.y_height = result.y;
                    this.x_width = result.x;
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    onChanged(cellname: string) {
        this.cellFrom = cellname;
    }

    onSelectCell(cell: StillageItemModel) {
        console.log(cell);
        if (this.isSelectInventory) {
            this.selectInventory(cell);
            console.log(this.listInventory);
        }
        if (cell.yxName && !cell.rowName && !cell.stillageName) {
            let splitted = cell.yxName.split(";");
            let nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
            if (nameStillage) {
                if (nameStillage === 'I1') {
                    this.openDetailStillageDialog(nameStillage + '-1-1');
                } else {
                    this.openDetailStillageDialog(nameStillage);
                }
            }
        }
    }

    selectInventory(cell: StillageItemModel) {
        if (!cell.isSelectCellStillage) {
            if (this.selectedInventory === 'choice-cell') {
                if ((cell.isVer || cell.isHor) && cell.isStillageOneWithName) {
                    var splitted = cell.yxName.split(";");
                    var nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
                    if (nameStillage) {
                        this.listInventory.push(new InventoryItemModel(cell, nameStillage));
                    }
                }
            }
            if (this.selectedInventory === 'choice-row') {
                if (cell.rowName) {
                    if (cell.isVer) {
                        var splitted = cell.yxName.split(";");
                        var nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
                        if (nameStillage) {
                            this.listInventory.push(new InventoryItemModel(cell, nameStillage));
                        }
                        for (var i: number = 1; i < this.y_height; i++) {
                            if (cell.y + i < this.y_height) {
                                if (this.tab_map[cell.y + i][cell.x].isVer && this.tab_map[cell.y + i][cell.x].rowName === cell.rowName) {
                                    var splitted = this.tab_map[cell.y + i][cell.x].yxName.split(";");
                                    var nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
                                    if (nameStillage) {
                                        this.listInventory.push(new InventoryItemModel(this.tab_map[cell.y + i][cell.x], nameStillage));
                                    }
                                }
                            }
                            if (cell.y - i >= 0) {
                                if (this.tab_map[cell.y - i][cell.x].isVer && this.tab_map[cell.y - i][cell.x].rowName === cell.rowName) {
                                    var splitted = this.tab_map[cell.y - i][cell.x].yxName.split(";");
                                    var nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
                                    if (nameStillage) {
                                        this.listInventory.push(new InventoryItemModel(this.tab_map[cell.y - i][cell.x], nameStillage));
                                    }
                                }
                            }
                        }
                    }
                    if (cell.isHor) {
                        var splitted = cell.yxName.split(";");
                        var nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
                        this.listInventory.push(new InventoryItemModel(cell, nameStillage));
                        for (var i: number = 1; i < this.x_width; i++) {
                            if (cell.y + i < this.x_width) {
                                if (this.tab_map[cell.y][cell.x + i].isVer && this.tab_map[cell.y][cell.x + i].rowName === cell.rowName) {
                                    var splitted = this.tab_map[cell.y][cell.x + i].yxName.split(";");
                                    var nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
                                    if (nameStillage) {
                                        this.listInventory.push(new InventoryItemModel(this.tab_map[cell.y][cell.x + i], nameStillage));
                                    }
                                }
                            }
                            if (cell.x - i >= 0) {
                                if (this.tab_map[cell.y][cell.x - i].isVer && this.tab_map[cell.y][cell.x - i].rowName === cell.rowName) {
                                    var splitted = this.tab_map[cell.y][cell.x - i].yxName.split(";");
                                    var nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
                                    if (nameStillage) {
                                        this.listInventory.push(new InventoryItemModel(this.tab_map[cell.y][cell.x - i], nameStillage));
                                    }
                                }
                            }
                        }
                    }
                    if (cell.isBraceVer) {
                        for (var i: number = 1; i < this.y_height - cell.y; i++) {
                            if (this.tab_map[cell.y + i][cell.x].isVer && this.tab_map[cell.y + i][cell.x].rowName === cell.rowName) {
                                var splitted = this.tab_map[cell.y + i][cell.x].yxName.split(";");
                                var nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
                                if (nameStillage) {
                                    this.listInventory.push(new InventoryItemModel(this.tab_map[cell.y + i][cell.x], nameStillage));
                                }
                            }
                        }
                    }
                    if (cell.isBraceHor) {
                        for (var i: number = 1; i < this.x_width - cell.x; i++) {
                            if (this.tab_map[cell.y][cell.x + i].isVer && this.tab_map[cell.y][cell.x + i].rowName === cell.rowName) {
                                var splitted = this.tab_map[cell.y][cell.x + i].yxName.split(";");
                                var nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
                                if (nameStillage) {
                                    this.listInventory.push(new InventoryItemModel(this.tab_map[cell.y][cell.x + i], nameStillage));
                                }
                            }
                        }
                    }
                }
            }
            this.listInventory.forEach(element => {
                element.stillageItem.isSelectCellStillage = true;
            });
        }
        else {
            var splitted = cell.yxName.split(";");
            var nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
            if (nameStillage) {
                this.listInventory = this.listInventory.filter(obj => obj.name !== nameStillage);
                cell.isSelectCellStillage = false;
            }
        }
    }

    onOkInventory() {
        if (this.listInventory.length > 0) {
            this.openInventoryDialog();
        } else {
            this.snackBarService.openRedSnackBar('Выберите стиллажи для инвентаризации')
        }
    }

    onSelectCellRotation(stillage: StillageItemModel) {
        let splitted = stillage.yxName.split(";");
        let nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
        if (nameStillage) {
            this.rotationItem = new InventoryItemModel(stillage, nameStillage);
        }
    }

    onClickCell(stillage: StillageItemModel, numberCell: string, floorCell: string) {
        let splitted = stillage.yxName.split(";");
        let nameStillage = this.tab_map[Number(splitted[0])][Number(splitted[1])].cellName;
        if (nameStillage) {
            if (this.cellFrom === '') {
                if (this.previousStillageFrom) {
                    this.tab_map[this.previousStillageFrom.y][this.previousStillageFrom.x].isSelectCellStillage = false;
                    // this.tab_map[this.previousStillageFrom.y][this.previousStillageFrom.x].element = '';
                }
                this.cellFrom = nameStillage + '-' + numberCell + '-' + floorCell;
                // stillage.element = numberCell + '' + floorCell + '-from';
                // stillage.isSelectCellStillage = true;
                // this.previousStillageFrom = stillage;
                // this.isFromTo = true;
            } else {
                if (this.cellTo === '') {
                    if (this.previousStillageTo) {
                        this.tab_map[this.previousStillageTo.y][this.previousStillageTo.x].isSelectCellStillage = false;
                        // this.tab_map[this.previousStillageTo.y][this.previousStillageTo.x].element = '';
                    }
                    this.cellTo = nameStillage + '-' + numberCell + '-' + floorCell;
                    // stillage.element = numberCell + '' + floorCell + '-to';
                    // stillage.isSelectCellStillage = true;
                    // this.previousStillageTo = stillage;
                    // this.isFromTo = true;
                }
            }
        }
    }
    clearSelectStillage() {
        this.tab_map.forEach(row => {
            row.forEach(element => {
                element.isSelectCellStillage = false;
            });
        });
        if (this.previousStillageTo) {
            this.tab_map[this.previousStillageTo.y][this.previousStillageTo.x].isSelectCellStillage = false;
            this.tab_map[this.previousStillageTo.y][this.previousStillageTo.x].element = '';
        }
        if (this.previousStillageFrom) {
            this.tab_map[this.previousStillageFrom.y][this.previousStillageFrom.x].isSelectCellStillage = false;
            this.tab_map[this.previousStillageFrom.y][this.previousStillageFrom.x].element = '';
        }
    }

    clearListInventory() {
        if (this.listInventory.length > 0) {
            this.listInventory.forEach(element => {
                element.stillageItem.isSelectCellStillage = false;
            });
        }
    }

    onClickClearFrom() {
        this.cellFrom = '';
        if (this.previousStillageFrom) {
            this.tab_map[this.previousStillageFrom.y][this.previousStillageFrom.x].isSelectCellStillage = false;
            this.tab_map[this.previousStillageFrom.y][this.previousStillageFrom.x].element = '';
        }
    }

    onClickClearTo() {
        this.cellTo = '';
        if (this.previousStillageTo) {
            this.tab_map[this.previousStillageTo.y][this.previousStillageTo.x].isSelectCellStillage = false;
            this.tab_map[this.previousStillageTo.y][this.previousStillageTo.x].element = '';
        }
    }

    openInventoryDialog() {
        const dialogRef = this.dialog.open(InventoryDialogFormComponent, {
            // width: '400px',
            height: '400px',
            data: { list: this.listInventory },
        });
        dialogRef.afterClosed().subscribe(result => {
            this.listInventory.forEach(element => {
                element.stillageItem.isSelectCellStillage = false;
            });
            this.listInventory = [];
        });
    }

    openDetailStillageDialog(cell: string) {
        const dialogRef = this.dialog.open(StillageDialogComponent, {
            data: { cell: cell },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        });
    }
}