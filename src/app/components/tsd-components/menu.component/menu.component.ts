import { Component } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SnackbarService } from "../../../services/snackbar.service";
import { LoginService } from "../../../services/login.service";
import { TokenService } from "../../../services/token.service";
import { Router } from "@angular/router";
import { environment } from "../../../environment";
import { CreateDocumentModel } from "../../../models/documents-models/create-document";
import { DocumentService } from "../../../services/document.service";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent {
    constructor(
        private dialog: MatDialog,
        private snackBarServcie: SnackbarService,
        private loginService: LoginService,
        private tokenService: TokenService,
        private router: Router,
    ) { }
    LogOut() {
        this.tokenService.deleteCookie();
        this.router.navigate(['login']);
    }
    openExitDialog() {
        const dialogRef = this.dialog.open(ExitDialog)
        dialogRef.afterClosed().subscribe(result => {
            switch (result) {
                case "true":
                    this.LogOut()
                    break;
                case "error":
                    this.snackBarServcie.openRedSnackBar("Ошибка создания документа")
                    break;
            }
        });
    }
    openDialog() {
        const dialogRef = this.dialog.open(CreateDocumentDialog)
        dialogRef.afterClosed().subscribe(result => {
            switch (result) {
                case "true":
                    break;
                case "error":
                    this.snackBarServcie.openRedSnackBar("Ошибка создания документа")
                    break;
            }
        });
    }

}
@Component({
    templateUrl: './create-document-dialog-window/create-document.dialog.html',
    styleUrls: ['./menu.component.scss']
})
export class CreateDocumentDialog {
    constructor(
        private router: Router,
        public dialogRef: MatDialogRef<CreateDocumentDialog>,
        private documentService: DocumentService,
        private tokenService: TokenService,
    ) { }
    docId: string
    docName: string
    docType: string
    createDoc() {
        let doc = new CreateDocumentModel(this.docName, this.tokenService.getLogin(), this.docType, this.tokenService.getToken())
        this.documentService.CreateDocument(doc).subscribe({
            next: result => {
                if (result) {
                    this.router.navigate(["work-space", result.id])
                    this.dialogRef.close("true")
                }
                else
                    this.dialogRef.close("error")
            },
            error: error => {
                console.log(error)
                this.dialogRef.close("error")
            }
        })
    }
}

@Component({
    templateUrl: './confirm-dialog/confirm-dialog.html',
    styleUrls: ['./menu.component.scss']
})
export class ExitDialog {
    constructor(
        public dialogRef: MatDialogRef<ExitDialog>,
    ) { }
    apply() {
        this.dialogRef.close("true")
    }
}
