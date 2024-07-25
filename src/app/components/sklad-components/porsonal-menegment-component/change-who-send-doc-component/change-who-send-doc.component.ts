import { Component, Inject, OnInit } from "@angular/core";
import { SnackbarService } from "../../../../services/snackbar.service";
import { PersonalService } from "../../../../services/personal.service";
import { TokenService } from "../../../../services/token.service";
import { TokenModel } from "../../../../models/token";
import { MatTableDataSource } from "@angular/material/table";
import { DocumentsListModel } from "../../../../models/documents-models/documents-list";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { WhoSendDocChangeModel } from "../../../../models/personal-models/who-send-doc-change-model";

@Component({
    selector: 'app-change-who-send-doc',
    templateUrl: './change-who-send-doc.component.html',
    styleUrl: './change-who-send-doc.component.scss'
})
export class ChangeWhoSendDocComponent {
    constructor(
        private snackBarService: SnackbarService,
        private personalService: PersonalService,
        private tokenService: TokenService,
        private dialog: MatDialog
    ) { }
    displayedColumns: string[] = ['docName', 'whoset', 'docType', 'docDate', 'doc_state', 'action'];
    searchInput: string
    docList: MatTableDataSource<DocumentsListModel>
    changeMode: boolean = false
    searchDoc() {
        this.personalService.GetUserDoc(new TokenModel(this.tokenService.getToken(), this.searchInput)).subscribe({
            next: result => {
                this.docList = new MatTableDataSource(result);
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }

    applyFilter(event: any) {
        let filter = event.target.value
        this.docList.filter = filter.trim().toLowerCase();
    }
    openChangeDialog(element: DocumentsListModel) {
        const dialogRef = this.dialog.open(ChangeWhoSendDocDialog, {
            data: element,
        });
        dialogRef.afterClosed().subscribe(result => {
            switch (result) {
                case 'true':
                    this.snackBarService.openSnackGreenBar('Изменено')
                    this.searchDoc()
                    break;
                case 'null':
                    this.snackBarService.openRedSnackBar('Пустое значение')
                    break;
                case 'error':
                    this.snackBarService.openRedSnackBar('Ошибка')
                    break;
                case 'BadAuth':
                    this.snackBarService.openRedSnackBar('Ошибка токена')
                    break;
            }
        });
    }
}

@Component({
    templateUrl: './change-who-send-dialog.html',
    styleUrl: './change-who-send-doc.component.scss'
})
export class ChangeWhoSendDocDialog implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<ChangeWhoSendDocDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DocumentsListModel,
        private personalService: PersonalService,
        private tokenService: TokenService
    ) { }
    changeRow: string | undefined = ''
    ngOnInit(): void {

        this.changeRow = this.data.whoset
    }
    apply() {
        this.personalService.ChangeWhoSetDoc(new WhoSendDocChangeModel(this.tokenService.getToken(), this.data.id, String(this.changeRow))).subscribe({
            next: result => {
                this.dialogRef.close(result.status)
            },
            error: error => {
                console.log(error);
            }
        })
    }
    cancel() {
        this.dialogRef.close()
    }
}