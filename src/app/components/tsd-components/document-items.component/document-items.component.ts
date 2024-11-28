import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TokenService } from "../../../services/token.service";
import { DocumentService } from "../../../services/document.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { TokenModel } from "../../../models/token";
import { EditProductModel } from "../../../models/documents-models/edit-product";
import { AgreeDialogComponent } from "../work-space.component/work-space.component";
import { DocumentBodyModel } from "../../../models/documents-models/document-body";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";

@Component({
    selector: 'app-document-items',
    templateUrl: './document-items.component.html',
    styleUrl: './document-items.component.scss',
    providers: [{
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
            subscriptSizing: 'dynamic'
        }
    }]
})
export class DocumentItemsComponent {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private tokenService: TokenService,
        private documentService: DocumentService,
        private snackBarService: SnackbarService,
        private dialog: MatDialog,
    ) {
        route.params.subscribe(params => this.docId = params["docId"]);
        route.params.subscribe(params => this.docType = params["docType"]);
        route.params.subscribe(params => this.docName = params["docName"]);
    }
    docId: number
    docType: string
    docName: string
    items: DocumentBodyModel[] = []
    showingItems: DocumentBodyModel[] = []
    totalPrice: number = 0
    ngOnInit(): void {
        this.GetDocumentItems()
    }
    searchRow: string
    FilterItems() {
        this.showingItems = this.items.filter(i => i.article.includes(this.searchRow) || i.place.includes(this.searchRow) || i.name.includes(this.searchRow))
    }
    filterCansel() {
        this.showingItems = this.items
        this.searchRow = ''
    }
    GetDocumentItems() {
        this.documentService.GetDocumentBody(new TokenModel(this.tokenService.getToken(), String(this.docId))).subscribe({
            next: result => {
                this.items = result
                this.showingItems = result
            },
            error: error => {
                console.log(error)
            }
        })
    }
    DeleteItem(element: number) {
        this.documentService.DeleteDocumentItem(new TokenModel(this.tokenService.getToken(), String(element))).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Удалено');
                        this.GetDocumentItems()
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
                this.snackBarService.openRedSnackBar();
            }
        })
    }
    switchEdit: boolean = false
    editItem: number
    count: number
    numb: number
    place: string

    EditItem(element: number, count?: string, numb?: number, place?: string) {
        if (this.switchEdit === false) {
            this.switchEdit = !this.switchEdit
            this.editItem = element
            this.count = Number(count)
            this.numb = numb!
            this.place = place!
        } else {
            this.documentService.EditProduct(new EditProductModel(this.tokenService.getToken(), element, this.count, this.numb, this.place)).subscribe({
                next: result => {
                    switch (result.status) {
                        case 'true':
                            this.snackBarService.openSnackGreenBar('Сохранено');
                            this.GetDocumentItems()
                            this.switchEdit = !this.switchEdit
                            this.editItem = 0
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
                    this.snackBarService.openRedSnackBar();
                }
            })
        }
    }
    pushDoc() {
        this.documentService.PushDocument(new TokenModel(this.tokenService.getToken(), String(this.docId))).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Документ успешно отправлен на сервер');
                        this.router.navigate(['tsd/menu'])
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
    openAgreeDialog() {
        const dialogRef = this.dialog.open(AgreeDialogComponent, { data: this.docId })
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
    goWorkSpace() {
        this.router.navigate(["tsd/work-space", this.docId, this.docType, this.docName])
    }
    goBack() {
        this.router.navigate(['tsd/menu'])
    }
    goMiniMap() {
        this.router.navigate(['tsd/mini-map'])
    }
    goArticleHistory() {
        this.router.navigate(['tsd/article-hist'])
    }
    goBase() {
        this.router.navigate(['tsd/base', this.docId, this.docType, this.docName])
    }
    goGSM() {
        let type = this.docType
        let name = this.docName
        this.router.navigate(['tsd/gsm', this.docId, type, name])
    }
}