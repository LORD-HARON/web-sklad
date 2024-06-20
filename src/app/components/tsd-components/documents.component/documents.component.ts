import { Component } from "@angular/core";
import { DocumentService } from "../../../services/document.service";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { Router } from "@angular/router";
import { DocumentsListModel } from "../../../models/documents-models/documents-list";
import { TokenModel } from "../../../models/token";

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrl: './documents.component.scss'
})
export class DocumentsComponent {
    constructor(
        private documentService: DocumentService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private router: Router
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
        this.documentService.DeleteDocument(new TokenModel(this.tokenService.getToken(), element)).subscribe({
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
}