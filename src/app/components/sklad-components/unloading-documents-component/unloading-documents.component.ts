import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { ProblemListModel } from "../../../models/task-models/problem-list";
import { MatTableDataSource } from "@angular/material/table";
import { NPCBodyModel } from "../../../models/task-models/npc-body";
import { ZPCBodyModel } from "../../../models/task-models/zpc-body";
import { DatePipe } from "@angular/common";
import { ProcService } from "../../../services/proc.service";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { RazgReqModel } from "../../../models/task-models/razg-req";
import { TaskService } from "../../../services/task.service";
import { RazgAnswModel } from "../../../models/task-models/razg-answ";
import { Workbook, Worksheet } from 'exceljs';
import { saveAs } from 'file-saver'
import { map } from "rxjs";
@Component({
    selector: 'app-unloading-documents',
    templateUrl: './unloading-documents.component.html',
    styleUrl: './unloading-documents.component.scss'
})
export class UnloadingDocumentsComponent {
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('btSearch', { read: ElementRef, static: false }) btSearch: ElementRef;

    displayedPcColumns = ['npc', 'zpc'];
    displayedCurrentPcColumns = ['article', 'name', 'count', 'count_ext', 'count_main', 'count_braq', 'place'];
    displayedColumns = ['doc_num', 'article', 'name', 'count', 'count_export', 'ost_main', 'ost_braq', 'place', 'action'];
    dataSource: MatTableDataSource<ProblemListModel>;

    problemList: Array<ProblemListModel> = [];

    listNpc: Array<NPCBodyModel> = [];
    listZpc: Array<ZPCBodyModel> = [];

    searchNpc: string = '';
    searchZpc: string = '';

    arrNpc: Array<string> = [];
    arrZpc: Array<string> = [];

    disabledValue = true;
    btSearchDisabled = false;

    constructor(
        private datePipe: DatePipe,
        private procService: ProcService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private taskService: TaskService
    ) { }

    ngOnInit() {
    }

    loadData(arrNpc: Array<string>, arrZpc: Array<string>) {
        console.log(arrNpc + '___' + arrZpc);

        this.taskService.Razg(new RazgReqModel(this.tokenService.getToken(), arrNpc, arrZpc)).subscribe({
            next: response => {
                if (response) {
                    this.setButtonSearchAble();
                    this.checkResponse(response);
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar();
            }
        });
    }

    checkResponse(response: RazgAnswModel) {
        console.log(response.npcList);
        this.dataSource = new MatTableDataSource(response.badSent);
        this.problemList = response.badSent;
        this.dataSource.sort = this.sort;
        this.listNpc = this.getListItemPcColor(response.npcList);
        this.listZpc = this.getListItemPcColor(response.zpcList);
    }

    onSearch() {
        let arrNpc = this.getArrayString(this.searchNpc);
        let arrZpc = this.getArrayString(this.searchZpc);
        console.log(arrNpc)
        if (arrNpc.length > 0 || arrZpc.length > 0) {
            this.setButtonSearchDisable();
            this.loadData(arrNpc, arrZpc);
        }
    }

    getArrayString(searchValue: string): Array<string> {
        if (searchValue.length > 0) {
            searchValue = searchValue.replace(/[^A-Za-z0-9а-яА-Я]/g, ' ');
            let arr = searchValue.split(' ');
            arr = arr.filter(Boolean);
            return arr;
        }
        else return [];
    }

    getListItemPcColor(list: Array<any>): Array<any> {
        list.map(function (item) {
            item.body.map(function (itemBody: any) {
                if (+itemBody.count_ext > 0) {
                    item.style = 'yellow';
                    return;
                }
            });
            return item;
        });
        return list;
    }

    onClear() {
        this.searchNpc = '';
        this.searchZpc = '';

        this.setButtonSearchAble();
    }

    setButtonSearchDisable() {
        this.disabledValue = true;
        this.btSearchDisabled = true;
        this.btSearch.nativeElement.disable = true;
    }

    setButtonSearchAble() {
        this.disabledValue = false;
        this.btSearchDisabled = false;
        this.btSearch.nativeElement.disable = false;
    }

    exportToExcel() {
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Документ');

        const title = 'Документ разгрузки';
        const header = ['№ Документа', 'Артикул', 'Наим.', 'Кол.', 'Не отгр.', 'Ост. основной', 'Ост. брак', 'Места хранения'];

        // Add new row
        let titleRow = worksheet.addRow([title]);
        // Set font, size and style in title row.
        titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
        worksheet.mergeCells('A1:C1');
        // Blank Row
        worksheet.addRow([]);
        //Add row with current date
        let subTitleRow = worksheet.addRow(['Дата : ' + this.datePipe.transform(new Date(), 'yyyy-MM-dd')]);

        //Add Header Row
        let headerRow = worksheet.addRow(header);
        // Cell Style : Fill and Border
        var font = { bold: true, size: 12 };
        headerRow.eachCell((cell, number) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
                cell.font = font
        });

        // Add Data and Conditional Formatting
        this.problemList.forEach(element => {
            let data = [element.doc_num, element.article, element.name, element.count, element.count_export, element.ost_main, element.ost_braq, element.place.toString()];
            let row = worksheet.addRow(data);
            let count_export = row.getCell(5);
            if (+count_export != null) {
                row.eachCell((cell, number) => {
                    cell.fill = {
                        type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' }, bgColor: { argb: 'FF0000FF' }
                    }
                });
            }
            row.eachCell((cell, number) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            });
        });

        // Set width and wrap text
        for (let i = 1; i <= worksheet.columns.length; i++) {
            worksheet.getColumn(i).width = 20;
        }
        worksheet.getColumn(3).alignment = { wrapText: true };
        worksheet.getColumn(3).width = 40;
        worksheet.getColumn(8).alignment = { wrapText: true };
        worksheet.getColumn(8).width = 40;


        this.setWorkSheetNpc(this.listNpc, worksheet, 'НПЦ');
        this.setWorkSheetZpc(this.listZpc, worksheet, 'ЗПЦ');

        this.listNpc.forEach(element => {
            workbook = this.addWorkSheetNpc(element, workbook);
        });

        this.listZpc.forEach(element => {
            workbook = this.addWorkSheetZpc(element, workbook);
        });
        console.log(123);
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Док ${this.datePipe.transform(new Date(), 'yyyy-MM-dd')}.xlsx`);
        });
    }

    setWorkSheetNpc(list: Array<NPCBodyModel>, worksheet: Worksheet, pc: string): Worksheet {
        worksheet.addRow([]);
        worksheet.addRow([pc]);
        list.forEach(element => {
            let row = worksheet.addRow([element.npC_NAME]);
            if (element.style === 'yellow') {
                row.eachCell((cell, number) => {
                    cell.fill = {
                        type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' }, bgColor: { argb: 'FF0000FF' }
                    }
                });
            }
            row.eachCell((cell, number) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            });
        });
        return worksheet;
    }

    setWorkSheetZpc(list: Array<ZPCBodyModel>, worksheet: Worksheet, pc: string): Worksheet {
        worksheet.addRow([]);
        worksheet.addRow([pc]);
        list.forEach(element => {
            let row = worksheet.addRow([element.zpC_NAME]);
            if (element.style === 'yellow') {
                row.eachCell((cell, number) => {
                    cell.fill = {
                        type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' }, bgColor: { argb: 'FF0000FF' }
                    }
                });
            }
            row.eachCell((cell, number) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            });
        });
        return worksheet;
    }

    addWorkSheetNpc(data: NPCBodyModel, workbook: Workbook): Workbook {
        let color = data.style === 'yellow' ? 'FFFF00' : 'FFFFFF';

        let worksheet = workbook.addWorksheet(data.npC_NAME, { properties: { tabColor: { argb: color } } });

        worksheet = this.createTablePc(data.body, data.npC_NAME, worksheet);

        return workbook;
    }

    addWorkSheetZpc(data: ZPCBodyModel, workbook: Workbook): Workbook {
        let color = data.style === 'yellow' ? 'FFFF00' : 'FFFFFF';

        let worksheet = workbook.addWorksheet(data.zpC_NAME, { properties: { tabColor: { argb: color } } });

        worksheet = this.createTablePc(data.body, data.zpC_NAME, worksheet);

        return workbook;
    }

    createTablePc(data: Array<any>, title: string, worksheet: Worksheet): Worksheet {
        let titleRow = worksheet.addRow([title]);
        titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
        worksheet.mergeCells('A1:B1');

        const header = ['Артикул', 'Наименование', 'Кол.', 'Не отгр.', 'Ост. основной', 'Ост. брак', 'Места хранения'];
        let headerRow = worksheet.addRow(header);

        var font = { bold: true, size: 12 };
        headerRow.eachCell((cell, number) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
                cell.font = font
        });
        data.forEach(element => {
            let data = [element.article, element.name, element.count, element.count_ext, element.count_main, element.count_braq, element.place.toString()];
            let row = worksheet.addRow(data);
            row.eachCell((cell, number) => {
                if (+element.count_ext > 0) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' }, bgColor: { argb: 'FF0000FF' } };
                }
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });
        });

        for (let i = 1; i <= worksheet.columns.length; i++) {
            worksheet.getColumn(i).width = 20;
        }

        worksheet.getColumn(2).width = 40;
        worksheet.getColumn(2).alignment = { wrapText: true };
        worksheet.getColumn(7).width = 40;
        worksheet.getColumn(7).alignment = { wrapText: true };

        return worksheet;
    }



}