import { Component, Inject, OnInit } from "@angular/core";
import { TokenService } from "../../../../services/token.service";
import { SnackbarService } from "../../../../services/snackbar.service";
import { PersonalService } from "../../../../services/personal.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SkladUserModel } from "../../../../models/login-models/sklad-user";
import { MatTableDataSource } from "@angular/material/table";
import { TokenModel } from "../../../../models/token";

@Component({
    selector: 'app-personal-list-form',
    templateUrl: './personal-list-form.component.html',
    styleUrl: './personal-list-form.component.scss'
})
export class PersonalListFormComponent implements OnInit {

    dataSource: MatTableDataSource<SkladUserModel>;
    selectItem: number;
    selectName: string;
    displayedColumns = ['name'];

    constructor(
        private tokenService: TokenService,
        private snackbarService: SnackbarService,
        private personalService: PersonalService,
        public dialogRef: MatDialogRef<PersonalListFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit() {
        this.personalService.GetSkladUser(new TokenModel(this.tokenService.getToken())).subscribe({
            next: response => {
                this.checkResponse(response);
            },
            error: error => {
                console.log(error);
                this.snackbarService.openSnackBar('Нет соединения, попробуйте позже', 'Ok');
            }
        });
    }

    checkResponse(response: Array<SkladUserModel>) {
        this.dataSource = new MatTableDataSource(response);
    }

    onSelectRow(i: number, row: SkladUserModel) {
        if (this.selectItem !== i) {
            this.selectName = row.login;
            this.selectItem = i;
        } else {
            this.selectName = '';
            this.selectItem = 0;
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
