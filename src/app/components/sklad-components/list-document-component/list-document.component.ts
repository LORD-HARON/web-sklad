import { Component, ViewChild } from "@angular/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatTableDataSource } from "@angular/material/table";
import { DocumentBodyModel } from "../../../models/documents-models/document-body";
import { PrintAnswModel } from "../../../models/task-models/print-answ";
import { MatSort } from "@angular/material/sort";
import { TaskService } from "../../../services/task.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { TokenService } from "../../../services/token.service";
import { MatDialog } from "@angular/material/dialog";
import { formatDate } from "@angular/common";
import { PrintComplateRequestModel } from "../../../models/task-models/print-complate-request";
import { E } from "@angular/cdk/keycodes";
import { DocumentService } from "../../../services/document.service";
import { TokenModel } from "../../../models/token";
@Component({
    selector: 'app-list-document',
    templateUrl: './list-document.component.html',
    styleUrl: './list-document.component.scss',
    providers: [{
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
            subscriptSizing: 'dynamic'
        }
    }]
})
export class ListDocumentComponent {
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    selectedSearchMode: string = 'docName'
    searchValue: string
    startDate: Date = new Date()
    finishDate: Date = new Date()
    docName: string = '';
    docId: number
    summ: number = 0;
    list: PrintAnswModel[] = [];
    docBodys: DocumentBodyModel[] = [];
    doc: PrintAnswModel;
    dataSource: MatTableDataSource<DocumentBodyModel>;
    displayedColumns = ['numb', 'article', 'barcode', 'count_e', 'place'];

    constructor(
        private taskService: TaskService,
        private snackBarService: SnackbarService,
        private tokenService: TokenService,
        private documentService: DocumentService
    ) { }

    onSearch() {
        switch (this.selectedSearchMode) {
            case 'docName':
                this.loadData(this.searchValue)
                break;
            case 'whoset':
                this.loadData('', this.searchValue)
                break;
            case 'date':
                this.loadData('', '', formatDate(this.startDate, 'dd.MM.yyyy 00:00:00', 'en-US'), formatDate(this.finishDate, 'dd.MM.yyyy 23:59:59', 'en-US'))
                break;
        }
    }
    loadData(docName: string = '', worker: string = '', dateFrom: string = '', dateTo: string = '') {
        this.taskService.PrintComplate(new PrintComplateRequestModel(this.tokenService.getToken(), docName, worker, dateFrom, dateTo)).subscribe({
            next: result => {
                this.list = result
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    selectDoc(element: PrintAnswModel) {
        this.docId = element.docId
        this.summ = 0;
        this.doc = element;
        this.dataSource = new MatTableDataSource(element.documentBody);
        this.docBodys = element.documentBody;
        this.docName = element.docName;
        this.docBodys.map(item => { this.summ += +item.count_e });
        this.dataSource.sort = this.sort;
    }
    generateDat() {
        this.documentService.GenerateFiles(new TokenModel(this.tokenService.getToken(), String(this.docId))).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Файл успешно создан')
                        break;
                    case 'NULL':
                        this.snackBarService.openRedSnackBar('Документ не найден')
                        break;
                    case 'error':
                        this.snackBarService.openRedSnackBar('Ошибка создания файлов')
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
}