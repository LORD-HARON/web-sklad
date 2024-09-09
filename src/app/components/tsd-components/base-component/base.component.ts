import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DocumentService } from "../../../services/document.service";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { MapService } from "../../../services/map.service";
import { AgreeDialogComponent } from "../work-space.component/work-space.component";
import { TokenModel } from "../../../models/token";
import { ProcService } from "../../../services/proc.service";
import { WDocAnswerModel } from "../../../models/proc-models/wdoc-answ";
import { BaseModel } from "../../../models/base-models/base";

@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrl: './base.component.scss'
})
export class BaseComponent implements OnInit {
    docId: number
    docType: string
    docName: string
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private documentService: DocumentService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private dialog: MatDialog,
        private procService: ProcService
    ) {
        route.params.subscribe(params => this.docId = params["docId"]);
        route.params.subscribe(params => this.docType = params["docType"]);
        route.params.subscribe(params => this.docName = params["docName"]);
    }
    base: BaseModel[]
    ngOnInit(): void {
        this.getBase()
    }
    getBase() {
        this.documentService.GetDocBase(new TokenModel(this.tokenService.getToken(), String(this.docId), String(this.docName))).subscribe({
            next: response => {
                if (response) {
                    this.base = response
                }
                else
                    this.snackBarService.openSnackBar('Основание не найдено')
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar();
            }
        });
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
    goGSM() {
        let type = this.docType
        let name = this.docName
        this.router.navigate(['tsd/gsm', this.docId, type, name])
    }

}