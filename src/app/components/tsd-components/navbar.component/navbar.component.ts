import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { MapService } from "../../../services/map.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { DocumentService } from "../../../services/document.service";
import { TokenService } from "../../../services/token.service";
import { TokenModel } from "../../../models/token";
export interface DocData {
    docId: number,
    docType: string,
    docName: string
}
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private documentService: DocumentService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private dialog: MatDialog,
        private mapService: MapService
    ) {
        route.params.subscribe(params => this.docData.docId = params["docId"]);
        route.params.subscribe(params => this.docData.docType = params["docType"]);
        route.params.subscribe(params => this.docData.docName = params["docName"]);
    }
    selectedItem: string = "1"
    docData: DocData = { docId: 0, docType: "", docName: "" }
    ngOnInit(): void {
        this.selectedItem = localStorage.getItem('tabIndex')!
    }
    selectItem(element: string) {
        this.selectedItem = element
        localStorage.setItem('tabIndex', element);
    }

    goArticleHistory() {
        this.router.navigate(['tsd/article-hist'])
    }
    goMiniMap() {
        this.router.navigate(['tsd/mini-map'])
    }
    goBack() {
        this.router.navigate(['tsd/menu'])
    }
    goBase() {
        let type = this.docData.docType
        let name = this.docData.docName
        console.log(type);
        this.router.navigate(['tsd/doc/base', this.docData.docId, type, name])
    }
    goGSM() {
        let type = this.docData.docType
        let name = this.docData.docName
        this.router.navigate(['tsd/doc/gsm', this.docData.docId, type, name])
    }
    openAgreeDialog() {
        const dialogRef = this.dialog.open(AgreeDialogComponent, { data: this.docData.docId })
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
        this.documentService.PushDocument(new TokenModel(this.tokenService.getToken(), String(this.docData.docId))).subscribe({
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
}

@Component({
    templateUrl: './agree.dialog.component/agree.dialog.component.html',
})
export class AgreeDialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<AgreeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: number,
        public tokenService: TokenService,
        public documentService: DocumentService
    ) { }
    count: number = 0
    GetDocumentItems() {
        this.documentService.GetDocumentBody(new TokenModel(this.tokenService.getToken(), String(this.data))).subscribe({
            next: result => {
                const newSet = new Set(result.map(x => x.article))
                this.count = Array.from(newSet) ? Array.from(newSet).length : 0
            },
            error: error => {
                console.log(error)
            }
        })
    }
    closeDialog(element: string) {
        this.dialogRef.close(element)
    }
    ngOnInit(): void {
        this.GetDocumentItems()
    }
}