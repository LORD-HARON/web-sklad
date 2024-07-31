import { Component, Inject, OnInit } from "@angular/core";
import { DocumentService } from "../../../services/document.service";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { Router } from "@angular/router";
import { DocumentsListModel } from "../../../models/documents-models/documents-list";
import { TokenModel } from "../../../models/token";
import { TaskService } from "../../../services/task.service";
import { PrintComplateRequestModel } from "../../../models/task-models/print-complate-request";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { DocumentBodyModel } from "../../../models/documents-models/document-body";

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrl: './documents.component.scss',
    providers: [{
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
            subscriptSizing: 'dynamic'
        }
    }]
})
export class DocumentsComponent {
    constructor(
        private documentService: DocumentService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private router: Router,
        private dialog: MatDialog
    ) { }
    documentList: DocumentsListModel[]
    ngOnInit(): void {
        this.GetDocumentList()
    }
    GetDocumentList() {
        this.documentService.GetDocumentList(new TokenModel(this.tokenService.getToken())).subscribe({
            next: result => {
                this.documentList = result
            },
            error: error => {
                console.log(error)
                this.snackBarService.openRedSnackBar();
            }
        })
    }
    DeleteDocument(element: number) {
        this.documentService.DeleteDocument(new TokenModel(this.tokenService.getToken(), String(element))).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar("Документ удален");
                        this.GetDocumentList()
                        break;
                    case 'NULL':
                        this.snackBarService.openRedSnackBar("Неверный запрос");
                        break;
                    case 'error':
                        this.snackBarService.openRedSnackBar();
                        break;
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Токен не действителен');
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar();
            }
        })
    }
    LoadDocument(element: number) {
        this.router.navigate(['tsd/work-space', element])
    }
    Back() {
        this.router.navigate(['tsd/menu'])
    }
    showSearch: boolean = false
    docSerachingRow: string
    serchDoc() {
        this.documentService.GetMyDocs(new TokenModel(this.tokenService.getToken(), this.docSerachingRow)).subscribe({
            next: result => {
                this.documentList = result
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    clear() {
        this.GetDocumentList()
    }
    pushDocAgain(element: number) {
        this.documentService.GenerateFiles(new TokenModel(this.tokenService.getToken(), String(element))).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Файл успешно создан')
                        break;
                    case 'NULL':
                        this.snackBarService.openSnackGreenBar('Документ не найден')
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
    docInputHandler() {
        if (this.docSerachingRow.length >= 14) {
            let LIT1 = this.docSerachingRow.substring(3, 5)
            let LIT2 = this.docSerachingRow.substring(5, 7)
            let NUM = this.docSerachingRow.substring(7, 14)
            this.docSerachingRow = this.GetLIT(LIT1) + this.GetLIT(LIT2) + NUM
        }
    }
    GetLIT(value: string) {
        switch (value) {
            case "01":
                return "А";
            case "02":
                return "Б";
            case "03":
                return "В";
            case "04":
                return "Г";
            case "05":
                return "Д";
            case "06":
                return "Е";
            case "07":
                return "Ж";
            case "08":
                return "И";
            case "09":
                return "К";
            case "10":
                return "Л";
            case "11":
                return "М";
            case "12":
                return "Н";
            case "13":
                return "О";
            case "14":
                return "П";
            case "15":
                return "Р";
            case "16":
                return "С";
            case "17":
                return "Т";
            case "18":
                return "У";
            case "19":
                return "Ф"
            case "20":
                return "Х";
            case "21":
                return "Ч";
            case "22":
                return "Ш";
            case "23":
                return "Э";
            case "24":
                return "Ю";
            case "25":
                return "Я";
            default: return "-";
        };
    }

    openDialog(element: number) {
        this.dialog.open(DocumentItemsDialog, {
            data: String(element),
        });
    }
}


@Component({
    templateUrl: './documents-items.dialog.html',
    styleUrl: './documents.component.scss'
})
export class DocumentItemsDialog implements OnInit {
    constructor(
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private documentService: DocumentService,
        @Inject(MAT_DIALOG_DATA) public data: string
    ) { }
    items: DocumentBodyModel[]
    ngOnInit(): void {
        this.documentService.GetDocumentBody(new TokenModel(this.tokenService.getToken(), this.data)).subscribe({
            next: result => {
                this.items = result
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
}