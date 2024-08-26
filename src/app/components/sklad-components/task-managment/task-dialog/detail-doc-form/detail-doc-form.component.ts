import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { DoctableModel, WDocAnswerModel } from "../../../../../models/proc-models/wdoc-answ";
import { ProcService } from "../../../../../services/proc.service";
import { SnackbarService } from "../../../../../services/snackbar.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TokenModel } from "../../../../../models/token";
import { TokenService } from "../../../../../services/token.service";

export interface DataDialog {
    token: string;
    docid: string;
}

@Component({
    selector: 'app-detail-doc-form',
    templateUrl: './detail-doc-form.component.html',
    styleUrls: ['./detail-doc-form.component.scss']
})
export class DetailDocFormComponent implements OnInit {

    @ViewChild('ngxPrint', { static: true }) ngxPrint: ElementRef;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    dataSource: MatTableDataSource<DoctableModel>;

    wDocAnswer: WDocAnswerModel = new WDocAnswerModel('', '', '', '', '', []);
    displayedColumns = ['num', 'article', 'name', 'count', 'mes', 'goods_main', 'brak', 'place'];
    imgSource: string = '';

    messageNoConnect = 'Нет соединения, попробуйте позже.';
    action = 'Ok';
    styleNoConnect = 'red-snackbar';

    date: Date;

    constructor(
        private procService: ProcService,
        private snackbarService: SnackbarService,
        public dialogRef: MatDialogRef<DetailDocFormComponent>,
        private tokenService: TokenService,
        @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    ) { }

    ngOnInit() {
        this.procService.GetDoc(new TokenModel(this.data.token, this.data.docid)).subscribe({
            next: response => {
                this.checkResponse(response);
            },
            error: error => {
                console.log(error);
                this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
            }
        });
        this.date = new Date();
    }

    checkResponse(response: any) {
        this.wDocAnswer = response;
        this.dataSource = new MatTableDataSource(this.wDocAnswer.docbody);
        this.dataSource.sort = this.sort;
        this.imgSource = 'https://barcode.tec-it.com/barcode.ashx?data=' + this.wDocAnswer.docbarcode;
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    onGetDateNow() {
        this.date = new Date();
        this.procService.CheckDocument(new TokenModel(this.tokenService.getToken(), this.wDocAnswer.docname)).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        setTimeout(this.ngxPrint.nativeElement.click(), 1000);
                        break;
                    case 'false':
                        this.snackbarService.openRedSnackBar('Документ уже в работе')
                        break;
                    case 'BadAuth':
                        this.snackbarService.openRedSnackBar('Не верный токен')
                        break;
                    case 'error':
                        this.snackbarService.openRedSnackBar()
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar()
            }
        })
    }
}