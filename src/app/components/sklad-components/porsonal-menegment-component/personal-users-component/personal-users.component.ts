import { Component, Inject, OnInit } from "@angular/core";
import { SnackbarService } from "../../../../services/snackbar.service";
import { TokenService } from "../../../../services/token.service";
import { PersonalService } from "../../../../services/personal.service";
import { TokenModel } from "../../../../models/token";
import { SkladUserModel } from "../../../../models/login-models/sklad-user";
import { NewSkladUserModel } from "../../../../models/personal-models/new-sklad-user";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";

@Component({
    selector: 'app-personal-users',
    templateUrl: './personal-users.component.html',
    styleUrl: './personal-users.component.scss'
})
export class PersonalUsersComponent implements OnInit {
    userTableHead: string[] = ['Логин', 'Группа', '']
    constructor(
        private snackBarService: SnackbarService,
        private tokenService: TokenService,
        private personalService: PersonalService,
        private dialog: MatDialog,
    ) { }
    userList: MatTableDataSource<SkladUserModel>
    displayedColumns: string[] = ['name', 'group', 'action'];
    groupList: string[] = ['admin', 'Ручная сборка', 'Сборка штабилером']
    userName: string
    selectedGroup: string
    selectItem: number
    ngOnInit(): void {
        this.getUsers()
    }

    getUsers() {
        this.personalService.GetSkladUser(new TokenModel(this.tokenService.getToken())).subscribe({
            next: result => {
                this.userList = new MatTableDataSource(result);
            },
            error: error => {
                console.log(error);
            }
        })
    }

    addNewUser() {
        this.personalService.AddNewSkladUser(new NewSkladUserModel(this.tokenService.getToken(), this.userName, this.selectedGroup)).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Пользователь добавлен')
                        this.getUsers()
                        break;
                    case 'error':
                        this.snackBarService.openRedSnackBar()
                        break;
                    case 'null':
                        this.snackBarService.openRedSnackBar('Пустое значение')
                        break;
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Неверный токен')
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }

    deleteUser(login: string, group: string) {
        this.personalService.DeleteSkladUser(new NewSkladUserModel(this.tokenService.getToken(), login, group)).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Пользователь удален')
                        this.getUsers()
                        break;
                    case 'error':
                        this.snackBarService.openRedSnackBar()
                        break;
                    case 'null':
                        this.snackBarService.openRedSnackBar('Пустое значение')
                        break;
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Неверный токен')
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }

    applyFilter(event: any) {
        let filter = event.target.value
        this.userList.filter = filter.trim().toLowerCase();
    }
    onPrintBadge(login: string) {
        const dialogRef = this.dialog.open(PersonalBadgeFormConponent, {
            data: { login: login, },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.userName = result;
            }
        });
    }
    GroupRemove() {

    }
    onSelectRow(i: any) {
        if (this.selectItem !== i)
            this.selectItem = i;
        else
            this.selectItem = 0;
    }
}

interface DialogData {
    login: string;
}
@Component({
    templateUrl: './print-badge-form.component.html',
    styleUrl: './personal-users.component.scss'
})
export class PersonalBadgeFormConponent {
    imgSource: string = '';

    constructor(
        public dialogRef: MatDialogRef<PersonalBadgeFormConponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    ngOnInit() {
        this.imgSource = 'https://barcode.tec-it.com/barcode.ashx?data=' + 'U:' + this.data.login;
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }
}