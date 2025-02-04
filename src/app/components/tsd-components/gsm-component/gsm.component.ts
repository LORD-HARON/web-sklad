import { Component, Input, OnInit } from "@angular/core";
import { DocumentService } from "../../../services/document.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { TokenService } from "../../../services/token.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TokenModel } from "../../../models/token";
import { GSMModel } from "../../../models/documents-models/gsm";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { GetGSMModel } from "../../../models/documents-models/get-gsm";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { AddGSMModel } from "../../../models/documents-models/add-gsm-codes";
import { DocData } from "../navbar.component/navbar.component";
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
    ) { }
    @Input() data: DocData
    displayTable: string[] = ['Артикул', 'DataMark', 'Отскан/Необход', 'Удалить все']

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
        this.documentService.GetGSMCodes(new TokenModel(this.tokenService.getToken(), String(this.data.docId))).subscribe({
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
        this.documentService.AddGSMCodes(new AddGSMModel(this.data.docId, this.selectedArticle, this.gsm)).subscribe({
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
        this.documentService.ClearGSM(new TokenModel('', String(this.data.docId), element)).subscribe({
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