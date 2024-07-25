import { Component, Inject, OnInit } from "@angular/core";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { PersonalService } from "../../../services/personal.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { TokenModel } from "../../../models/token";
import { DocSendsUsersModel } from "../../../models/personal-models/doc-sends.users";
import { map, Observable, startWith } from "rxjs";
import { FormControl } from "@angular/forms";
import { DatePipe, formatDate } from "@angular/common";
import { MatTableDataSource } from "@angular/material/table";
import { MotivationModel } from "../../../models/personal-models/motivation";
import { MotivationQueryModel } from "../../../models/personal-models/motivation-query";
import { MotivationAnswModel } from "../../../models/personal-models/motivation-answ";

@Component({
    selector: 'app-motivation',
    templateUrl: './motivation.component.html',
    styleUrl: './motivation.component.scss'
})
export class MotivationComponent implements OnInit {
    constructor(
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private personalService: PersonalService,
        private dialog: MatDialog
    ) { }
    displayedColumns = ['user', 'motivation'];
    dataSource: MatTableDataSource<MotivationAnswModel>;
    docUserList: DocSendsUsersModel = new DocSendsUsersModel(['Все'])
    filteredOptions: Observable<string[]>;
    myControl = new FormControl();
    startDate: Date = new Date()
    finishDate: Date = new Date()
    showLoader: boolean = false
    loadedCompleat: boolean = false
    ngOnInit(): void {
        this.getUsersDoc()
    }
    getUsersDoc() {
        this.personalService.GetSendedDocUsers(new TokenModel(this.tokenService.getToken())).subscribe({
            next: result => {
                this.docUserList.login = this.docUserList.login.concat(result.login);
                this.filteredOptions = this.myControl.valueChanges
                    .pipe(
                        startWith(''),
                        map(value => this._filter(value))
                    );
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.docUserList.login.filter(option => option.toLowerCase().includes(filterValue));
    }
    onSearch() {
        if (this.myControl.value === 'Все')
            this.getMotivation(formatDate(this.startDate, 'dd.MM.yyyy', 'en-US'), formatDate(this.finishDate, 'dd.MM.yyyy', 'en-US'), '');
        else
            this.getMotivation(formatDate(this.startDate, 'dd.MM.yyyy', 'en-US'), formatDate(this.finishDate, 'dd.MM.yyyy', 'en-US'), this.myControl.value);
    }
    getMotivation(startDate: string, finishDate: string, user: string) {
        this.showLoader = true
        this.loadedCompleat = false
        this.personalService.GetMotivation(new MotivationQueryModel(this.tokenService.getToken(), startDate, finishDate, user)).subscribe({
            next: result => {
                this.dataSource = new MatTableDataSource(result);
                this.showLoader = false
                this.loadedCompleat = true
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
                this.showLoader = false
                this.loadedCompleat = false
            }
        })
    }
    onCalculatePositions(data: MotivationAnswModel[]) {
        let mtOtbor = 0;
        let mtPriem = 0;
        let mtImport = 0;
        let mtRotac = 0;
        data.forEach(element => {
            element.motivation.forEach(elementMotive => {
                switch (elementMotive.typeName) {
                    case 'Отборка':
                        mtOtbor += +elementMotive.countPos;
                        break;
                    case 'Приемка':
                        mtPriem += +elementMotive.countPos;
                        break;
                    case 'Импорт':
                        mtImport += +elementMotive.countPos;
                        break;
                    case 'Ротация':
                        mtRotac += +elementMotive.countPos;
                        break;
                }
            });
        });
        this.openMotivateSumPositionForm(mtOtbor, mtPriem, mtImport, mtRotac)
    }
    openMotivateSumPositionForm(mtOtbor: number, mtPriem: number, mtImport: number, mtRotac: number) {
        const dialogRef = this.dialog.open(MotivationSumPositionDialogComponent, {
            width: "300px",
            data: { startDate: formatDate(this.startDate, 'dd.MM.yyyy', 'en-US'), finishDate: formatDate(this.finishDate, 'dd.MM.yyyy', 'en-US'), mtOtbor: mtOtbor, mtPriem: mtPriem, mtImport: mtImport, mtRotac: mtRotac }
        });
        dialogRef.afterClosed().subscribe(result => {
            mtOtbor = 0;
            mtPriem = 0;
            mtImport = 0;
            mtRotac = 0;
        });
    }
}

interface DialogData {
    startDate: string;
    finishDate: string;
    mtOtbor: number;
    mtPriem: number;
    mtImport: number;
    mtRotac: number;
}
@Component({
    templateUrl: './motivation-sum-positions-dialog.component.html',
    styleUrl: './motivation.component.scss'
})
export class MotivationSumPositionDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<MotivationSumPositionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }
}