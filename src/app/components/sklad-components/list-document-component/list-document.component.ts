import { Component, ViewChild } from "@angular/core";
import { PrintAnswModel } from "../../../models/task-models/print-answ";
import { DocumentBodyModel } from "../../../models/documents-models/document-body";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { ProcService } from "../../../services/proc.service";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { TaskService } from "../../../services/task.service";
import { TokenModel } from "../../../models/token";
import { MatSort } from "@angular/material/sort";

@Component({
    selector: 'app-list-document',
    templateUrl: './list-document.component.html',
    styleUrl: './list-document.component.scss'
})
export class ListDocumentComponent {
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    doc: PrintAnswModel;
    list: Array<PrintAnswModel> = [];
    docBodys: Array<DocumentBodyModel> = [];
    dataSource: MatTableDataSource<DocumentBodyModel>;
    docName: string = '';
    docNameSelect: string = '';
    summ: number = 0;

    displayedColumns = ['numb', 'article', 'barcode', 'count_e', 'place'];

    constructor(
        private dialog: MatDialog,
        private procService: ProcService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private taskService: TaskService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.taskService.PrintComplate(new TokenModel(this.tokenService.getToken(), '')).subscribe({
            next: response => {
                this.checkResponse(response);
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar();
            }
        });
    }
    checkResponse(response: any) {
        if (response.status === 'empty')
            this.snackBarService.openSnackBar('Нет документов', 'OK');
        else if (response.length > 0) {
            this.list = response;
        }
    }

    onSelectDoc(element: PrintAnswModel) {
        this.summ = 0;
        this.doc = element;
        this.dataSource = new MatTableDataSource(element.documentBody);
        this.docBodys = element.documentBody;
        this.docName = element.docName;
        this.docBodys.map(item => { this.summ += +item.count_e });
        this.dataSource.sort = this.sort;
    }
}