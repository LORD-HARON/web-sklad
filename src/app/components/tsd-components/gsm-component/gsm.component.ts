import { Component, OnInit } from "@angular/core";
import { DocumentService } from "../../../services/document.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { TokenService } from "../../../services/token.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TokenModel } from "../../../models/token";
import { GSMModel } from "../../../models/documents-models/gsm";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AgreeDialogComponent } from "../work-space.component/work-space.component";
import { GetGSMModel } from "../../../models/documents-models/get-gsm";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { AddGSMModel } from "../../../models/documents-models/add-gsm-codes";

@Component({
    selector: 'app-gsm',
    templateUrl: './gsm.component.html',
    styleUrl: './gsm.component.scss',
    providers: [{
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
            subscriptSizing: 'dynamic'
        }
    }]
})
export class GSMComponent implements OnInit {
    constructor(
        private documentService: DocumentService,
        private snackBarService: SnackbarService,
        private tokenService: TokenService,
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog,
    ) {
        route.params.subscribe(params => this.docId = params["docId"]);
        route.params.subscribe(params => this.docType = params["docType"]);
        route.params.subscribe(params => this.docName = params["docName"]);
    }
    displayTable: string[] = ['Артикул', 'DataMark', 'Отскан/Необход', 'Удалить все']
    docId: number
    docType: string
    docName: string

    gsmCodes: GetGSMModel[]
    showingGSMCodes: GetGSMModel[]
    gsm: string
    filter: string
    selectedArticle: string

    ngOnInit(): void {
        this.GetGSM()
    }
    sumCodes: number = 0
    sumCount: number = 0
    inputAdd(event: any) {
        var number = event.target.value;
        if (number.length > 82 && this.selectedArticle) {
            this.addDataMark()
        }
    }
    inputFilter() {
        if (this.filter != '')
            this.showingGSMCodes = this.gsmCodes.filter(i => i.article.includes(this.filter))
        else
            this.showingGSMCodes = this.gsmCodes
    }
    GetGSM() {
        this.documentService.GetGSMCodes(new TokenModel(this.tokenService.getToken(), String(this.docId))).subscribe({
            next: result => {
                if (result)
                    this.gsmCodes = result
                this.showingGSMCodes = this.gsmCodes
                this.sumCount = 0
                this.sumCodes = 0
                this.gsmCodes.forEach(x => {
                    this.sumCount += x.count == null ? 0 : x.count
                    this.sumCodes += x.codes == null ? 0 : x.codes.length
                })
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    addDataMark() {
        this.documentService.AddGSMCodes(new AddGSMModel(this.docId, this.selectedArticle, this.gsm)).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Код добавлен')
                        this.GetGSM()
                        this.gsm = ''
                        var input = document.getElementById('barcodeInput')
                        input!.focus()
                        break;
                    case 'false':
                        this.snackBarService.openRedSnackBar('Данный код уже записан')
                        break;
                    case 'null':
                        this.snackBarService.openRedSnackBar('Пустой запрос')
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    deleteDataMark(element: string) {
        this.documentService.DeleteGSMCode(new TokenModel('', element)).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Удалено')
                        this.GetGSM()
                        break;
                    case 'NULL':
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }

    clearDataMark(element: string) {
        this.documentService.ClearGSM(new TokenModel('', String(this.docId), element)).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Удалены все коды по артикулу')
                        setTimeout(() => { this.GetGSM() }, 1000)
                        break;
                    case 'NULL':
                        this.snackBarService.openRedSnackBar('Пустой запрос')
                        break;
                    case 'error':
                        this.snackBarService.openRedSnackBar()
                        break;
                }
            },
            error: error => {
                console.log(error);
            }
        })
    }

    openAgreeDialog() {
        const dialogRef = this.dialog.open(AgreeDialogComponent)
        dialogRef.afterClosed().subscribe(result => {
            switch (result) {
                case "true":
                    this.pushDoc();
                    break;
                case "false":
                    break;
            }
        });
    }
    pushDoc() {
        this.documentService.PushDocument(new TokenModel(this.tokenService.getToken(), String(this.docId))).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Документ успешно отправлен на сервер');
                        this.router.navigate(['/tsd/menu'])
                        break;
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Токен устарел');
                        break;
                    case 'NULL':
                        this.snackBarService.openRedSnackBar('NULL');
                        break;
                    case 'error':
                        this.snackBarService.openRedSnackBar('Ошибка');
                        break;
                }
            },
            error: error => {
                console.log(error)
            }
        })
    }
    openDeleteDialog(element: string) {
        const dialogRef = this.dialog.open(GSMDeleteDialog)
        dialogRef.afterClosed().subscribe(result => {
            switch (result) {
                case "true":
                    this.clearDataMark(element)
                    break;
            }
        });
    }
    openDocumentItems() {
        let type = this.docType
        let name = this.docName
        this.router.navigate(["tsd/document-items", this.docId, type, name])
    }
    goWorkSpace() {
        this.router.navigate(["tsd/work-space", this.docId, this.docType, this.docName])
    }
    goBack() {
        this.router.navigate(['tsd/menu'])
    }
    goArticleHistory() {
        this.router.navigate(['tsd/article-hist'])
    }
    goMiniMap() {
        this.router.navigate(['tsd/mini-map'])
    }
    goBase() {
        this.router.navigate(['tsd/base'])
    }
}

@Component({
    templateUrl: './gsm.delete.dialog.html',
    styleUrl: './gsm.component.scss'
})
export class GSMDeleteDialog {
    constructor(
        public dialogRef: MatDialogRef<GSMDeleteDialog>,
    ) { }
    apply() {
        this.dialogRef.close("true")
    }
}