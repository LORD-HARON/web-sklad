import { Component } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SnackbarService } from "../../../services/snackbar.service";
import { LoginService } from "../../../services/login.service";
import { TokenService } from "../../../services/token.service";
import { Router } from "@angular/router";
import { environment } from "../../../environment";
import { CreateDocumentModel } from "../../../models/documents-models/create-document";
import { DocumentService } from "../../../services/document.service";
import { MapService } from "../../../services/map.service";
import { TokenModel } from "../../../models/token";
import { CellBodyModel } from "../../../models/map-models/cell-answ";

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
    openCellSearch() {
        this.router.navigate(['tsd/mini-map']);
    }
    // openCellSearchDialog() {
    //     const dialogRef = this.dialog.open(CellSearchDialog)
    //     dialogRef.afterClosed().subscribe(result => {
    //     });
    // }
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
    User: string = this.tokenService.getLogin()
    createDoc() {
        let doc = new CreateDocumentModel(this.docName, this.tokenService.getLogin(), this.docType, this.tokenService.getToken())
        this.documentService.CreateDocument(doc).subscribe({
            next: result => {
                if (result) {
                    this.router.navigate(["tsd/work-space", result.id, result.doc_type, result.doc_name])
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
    docInputHandler() {
        if (this.docName.length >= 14) {
            let LIT1 = this.docName.substring(3, 5)
            let LIT2 = this.docName.substring(5, 7)
            let NUM = this.docName.substring(7, 14)
            this.docName = this.GetLIT(LIT1) + this.GetLIT(LIT2) + NUM
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

@Component({
    templateUrl: './cell-search-dialog/cell-search.dialog.html',
    styleUrls: ['./menu.component.scss']
})
export class CellSearchDialog {
    constructor(
        private dialogRef: MatDialogRef<CellSearchDialog>,
        private mapService: MapService,
        private tokenService: TokenService
    ) { }

    cellInput: string
    cellBody: CellBodyModel[] = []
    showTable: boolean = false
    InputHandel(event: any) {
        var number = event.target.value;
        if (number.length >= 8) {
            this.getCell()
        }
    }
    close() {
        this.dialogRef.close()
    }
    getCell() {
        let cell = this.cellInput.replace('PLACE:', '')
        this.mapService.GetCell(new TokenModel(this.tokenService.getToken(), cell)).subscribe({
            next: result => {
                this.cellBody = result.body
                this.showTable = true
                var input = document.getElementById('cellInput')!
                input.blur();
            },
            error: error => {
                console.log(error);
            }
        })
    }

}

