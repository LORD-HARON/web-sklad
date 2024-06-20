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

@Component({
    selector: 'app-document-items',
    templateUrl: './document-items.component.html',
    styleUrl: './document-items.component.scss'
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
    }
    docId: number

    items: DocumentBodyModel[] = []
    totalPrice: number = 0
    ngOnInit(): void {
        this.GetDocumentItems()
    }
    GetDocumentItems() {
        this.documentService.GetDocumentBody(new TokenModel(this.tokenService.getToken(), this.docId)).subscribe({
            next: result => {
                this.items = result
                result.forEach(element => {
                    console.log(element)
                    if (!element.price || !element.count_e)
                        this.totalPrice += 0
                    else
                        this.totalPrice += (Number(element.price.replace(',', '.')) * Number(element.count_e))
                });
            },
            error: error => {
                console.log(error)
            }
        })
    }
    DeleteItem(element: number) {
        this.documentService.DeleteDocumentItem(new TokenModel(this.tokenService.getToken(), element)).subscribe({
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
    count: number
    numb: number
    EditItem(element: number, count?: string, numb?: number) {
        if (this.switchEdit === false) {
            this.switchEdit = !this.switchEdit
            this.count = Number(count)
            this.numb = numb!
        } else {
            this.documentService.EditProduct(new EditProductModel(this.tokenService.getToken(), element, this.count, this.numb)).subscribe({
                next: result => {
                    switch (result.status) {
                        case 'true':
                            this.snackBarService.openSnackGreenBar('Сохранено');
                            this.GetDocumentItems()
                            this.switchEdit = !this.switchEdit
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
        this.documentService.PushDocument(new TokenModel(this.tokenService.getToken(), this.docId)).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Документ успешно отправлен на сервер');
                        this.router.navigate([''])
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
    goWorkSpace() {
        this.router.navigate(["tsd/work-space", this.docId])
    }
    goBack() {
        this.router.navigate(['tsd/menu'])
    }
}