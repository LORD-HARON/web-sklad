import { Component, Inject, OnInit } from "@angular/core";
import { SkladUserModel } from "../../../../../models/login-models/sklad-user";
import { TokenService } from "../../../../../services/token.service";
import { SnackbarService } from "../../../../../services/snackbar.service";
import { PersonalService } from "../../../../../services/personal.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TokenModel } from "../../../../../models/token";

@Component({
    selector: 'app-select-user-form',
    templateUrl: './select-user-form.component.html',
    styleUrl: './select-user-form.component.scss'
})
export class SelectUserFormComponent implements OnInit {

    usersSource: Array<SkladUserModel>;
    selectLogin: string = '';
    displayedColumnsGrop = ['index', 'login', 'group'];

    messageNoConnect = 'Нет соединения, попробуйте позже.';
    action = 'Ok';
    styleNoConnect = 'red-snackbar';

    constructor(
        private tokenService: TokenService,
        private snackbarService: SnackbarService,
        private personalService: PersonalService,
        public dialogRef: MatDialogRef<SelectUserFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.personalService.GetSkladUser(new TokenModel(this.tokenService.getToken())).subscribe({
            next: response => {
                this.usersSource = response;
            },
            error: error => {
                console.log(error);
                this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
            }
        });
    }

    onSelectRow(item: SkladUserModel) {
        this.selectLogin = item.login;
    }

    onOkClick(): void {
        this.dialogRef.close(this.selectLogin);
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    onClearClick() {
        this.selectLogin = '';
    }
}
