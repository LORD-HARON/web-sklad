import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { AnswerDocModel } from "../../../../../models/proc-models/answer-doc";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ProcService } from "../../../../../services/proc.service";
import { TokenService } from "../../../../../services/token.service";
import { SnackbarService } from "../../../../../services/snackbar.service";
import { TokenModel } from "../../../../../models/token";
import { DetailDocFormComponent } from "../detail-doc-form/detail-doc-form.component";

export interface DialogData {
    list: Array<ListItem>;
}

export interface EmitData {
    doc: AnswerDocModel;
    type: string;
}

export class ListItem {
    constructor(
        public title: string,
        public item: string,
    ) { }
}

@Component({
    selector: 'app-doc-list',
    templateUrl: './doc-list.component.html',
    styleUrl: './doc-list.component.scss'
})
export class DocListComponent implements OnInit {

    @ViewChild('sortPrihod', { static: true }) sortPrihod: MatSort;
    @ViewChild('sortZpc', { static: true }) sortZpc: MatSort;
    @ViewChild('sortPerem', { static: true }) sortPerem: MatSort;
    @ViewChild('sortVozv', { static: true }) sortVozv: MatSort;

    displayedColumns = ['docLabel', 'docId', 'docDate', 'docLoc', 'icon'];
    displayedListColumns = ['title'];

    dataSourcePrihod: MatTableDataSource<AnswerDocModel>;
    dataSourceZpc: MatTableDataSource<AnswerDocModel>;
    dataSourcePerem: MatTableDataSource<AnswerDocModel>;
    dataSourceVozv: MatTableDataSource<AnswerDocModel>;

    dataSource: Array<AnswerDocModel> = [];
    filterArray: Array<AnswerDocModel> = [];

    list: Array<ListItem> = [];
    selectDoc: ListItem;

    messageNoConnect = 'Нет соединения, попробуйте позже.';
    action = 'Ok';
    styleNoConnect = 'red-snackbar';

    strPrihod: string = 'Приходные';
    strZpc: string = 'Заявки';
    strPerem: string = 'Перемещение';
    strVozv: string = 'Возвраты';

    matTab0: boolean = true;
    matTab1: boolean = false;
    matTab2: boolean = false;
    matTab3: boolean = false;

    constructor(
        public dialog: MatDialog,
        private procService: ProcService,
        private tokenService: TokenService,
        private snackbarService: SnackbarService,
        public dialogRef: MatDialogRef<DocListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    ngOnInit() {
        this.list = JSON.parse(JSON.stringify(this.data.list))
        this.getDataSourcePrihod();
    }

    ngOnDestroy() {
        this.list = [];
        this.data.list = [];
        if (this.dataSourcePrihod)
            if (this.dataSourcePrihod.data)
                this.dataSourcePrihod.data.forEach(element => {
                    element.highLighted = false;
                });
        if (this.dataSourceZpc)
            if (this.dataSourceZpc.data)
                this.dataSourceZpc.data.forEach(element => {
                    element.highLighted = false;
                });
        if (this.dataSourcePerem)
            if (this.dataSourcePerem.data)
                this.dataSourcePerem.data.forEach(element => {
                    element.highLighted = false;
                });
        if (this.dataSourceVozv)
            if (this.dataSourceVozv.data)
                this.dataSourceVozv.data.forEach(element => {
                    element.highLighted = false;
                });
    }

    onOkClick(): void {
        this.dialogRef.close(this.list);
    }

    onCancelClick(): void {
        this.list = [];
        this.data.list = [];
        this.dialogRef.close();
    }

    onClearClick(): void {
        this.clearTable(this.list[0].title);
        this.list = [];
    }

    onClickTabItem(element: AnswerDocModel, title: string) {
        element.highLighted = !element.highLighted;
        this.selectDoc = new ListItem(title, element.docId);
        let isIn = false;
        this.list.forEach(element => {
            if (JSON.stringify(element) === JSON.stringify(this.selectDoc))
                isIn = true;
        });
        if (isIn)
            this.list = this.list.filter(item => item.item !== this.selectDoc.item);
        else
            if (this.list.length === 0) {
                this.list.push(this.selectDoc);
            } else {
                if (this.list[0].title === title) {
                    if (!this.list.find(item => item.item === element.docId)) {
                        this.list = this.list.concat(this.selectDoc);
                    }
                } else {
                    this.clearTable(this.list[0].title);
                    this.list = [];
                    this.list = this.list.concat(this.selectDoc);
                }
            }
    }

    onClickListItem(selectItem: ListItem) {
        if (this.list.includes(selectItem)) {
            this.list = this.list.filter(item => item !== selectItem);
            switch (selectItem.title) {
                case 'Приходные':
                    if (this.dataSourcePrihod.data.length > 0)
                        this.dataSourcePrihod.data.forEach(element => {
                            if (element.docId === selectItem.item) {
                                element.highLighted = false;
                            }
                        });
                    break;
                case 'Заявки':
                    if (this.dataSourceZpc.data.length > 0)
                        this.dataSourceZpc.data.forEach(element => {
                            if (element.docId === selectItem.item) {
                                element.highLighted = false;
                            }
                        });
                    break;
                case 'Перемещение':
                    if (this.dataSourcePerem.data.length > 0)
                        this.dataSourcePerem.data.forEach(element => {
                            if (element.docId === selectItem.item) {
                                element.highLighted = false;
                            }
                        });
                    break;
                case 'Возвраты':
                    if (this.dataSourceVozv.data.length > 0)
                        this.dataSourceVozv.data.forEach(element => {
                            if (element.docId === selectItem.item) {
                                element.highLighted = false;
                            }
                        });
                    break;
            }

        }
    }

    clearTable(title: string) {
        if (title === 'Приходные')
            this.setHighlightedFalse(this.dataSourcePrihod);
        if (title === 'Заявки')
            this.setHighlightedFalse(this.dataSourceZpc);
        if (title === 'Перемещение')
            this.setHighlightedFalse(this.dataSourcePerem);
        if (title === 'Возвраты')
            this.setHighlightedFalse(this.dataSourceVozv);
    }

    setHighlightedFalse(dataSource: MatTableDataSource<AnswerDocModel>) {
        if (dataSource)
            if (dataSource.data.length > 0)
                dataSource.data.forEach(element => {
                    if (element.highLighted)
                        element.highLighted = !element.highLighted;
                });
    }

    openDeatilDocForm(element: AnswerDocModel) {
        const dialogRef = this.dialog.open(DetailDocFormComponent, {
            width: "70vw",
            height: "86vh",
            data: { token: this.tokenService.getToken(), docid: element.docId },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        });
    }

    onChanged(data: EmitData) {
        data.doc.highLighted = !data.doc.highLighted;
        this.selectDoc = new ListItem(data.type, data.doc.docId);
        let isIn = false;
        this.list.forEach(element => {
            if (JSON.stringify(element) === JSON.stringify(this.selectDoc))
                isIn = true;
        });
        if (isIn)
            this.list = this.list.filter(item => item.item !== this.selectDoc.item);
        else
            if (this.list.length === 0) {
                this.list.push(this.selectDoc);
            } else {
                if (this.list[0].title === data.type) {
                    if (!this.list.find(item => item.item === data.doc.docId)) {
                        this.list = this.list.concat(this.selectDoc);
                    }
                } else {
                    this.clearTable(this.list[0].title);
                    this.list = [];
                    this.list = this.list.concat(this.selectDoc);
                }
            }
    }

    onClickTab($event: any) {
        switch ($event.index) {
            case 0:
                if (!this.matTab0) {
                    this.getDataSourcePerem();
                    this.matTab1 = true;
                }
                break;
            case 1:
                if (!this.matTab1) {
                    this.getDataSourceZpc();
                    this.matTab1 = true;
                }
                break;
            case 2:
                if (!this.matTab2) {
                    this.getDataSourcePerem();
                    this.matTab1 = true;
                }
                break;
            case 3:
                if (!this.matTab3) {
                    this.getDataSourceVozv();
                    this.matTab1 = true;
                }
                break;
        }
    }

    getDataSourcePrihod() {
        this.procService.GetPrihod(new TokenModel(this.tokenService.getToken())).subscribe({
            next: response => {
                this.dataSourcePrihod = new MatTableDataSource(response);
                this.deleteZero(this.dataSourcePrihod.data)
                this.dataSourcePrihod.sort = this.sortPrihod
            },
            error: error => {
                console.log(error);
                this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
            }
        });
    }

    getDataSourceZpc() {
        this.procService.GetZPC(new TokenModel(this.tokenService.getToken())).subscribe({
            next: response => {
                this.dataSourceZpc = new MatTableDataSource(response);
                this.deleteZero(this.dataSourceZpc.data);
                this.dataSourceZpc.sort = this.sortZpc;
            },
            error: error => {
                console.log(error);
                this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
            }
        });
    }

    getDataSourcePerem() {
        this.procService.GetPerem(new TokenModel(this.tokenService.getToken())).subscribe({
            next: response => {
                this.dataSourcePerem = new MatTableDataSource(response);
                this.deleteZero(this.dataSourcePerem.data);
                this.dataSourcePerem.sort = this.sortPerem;
            },
            error: error => {
                console.log(error);
                this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
            }
        });
    }

    getDataSourceVozv() {
        this.procService.GetVozv(new TokenModel(this.tokenService.getToken())).subscribe({
            next: response => {
                this.dataSourceVozv = new MatTableDataSource(response);
                this.deleteZero(this.dataSourceVozv.data);
                this.dataSourceVozv.sort = this.sortVozv;
            },
            error: error => {
                console.log(error);
                this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
            }
        });
    }

    deleteZero(list: Array<AnswerDocModel>) {
        if (list)
            list.forEach(element => {
                element.docDate = element.docDate.split(' ')[0];
            });
    }

    applyFilterPrihod(event: any) {
        let filterValue = event.target.value
        if (this.dataSource.length < this.dataSourcePrihod.data.length)
            this.dataSource = this.dataSourcePrihod.data;

        let arrStr = filterValue.split(' ');
        if (arrStr.length > 1) {
            if (this.dataSource.length > this.dataSourcePrihod.data.length) {
                this.filterArray = this.dataSource.filter(item => arrStr.includes(item.docId)).map(item => (new AnswerDocModel(item.docId, item.docDate, item.docloc, item.docLabel, item.highLighted)));
            } else {
                this.filterArray = this.dataSourcePrihod.data.filter(item => arrStr.includes(item.docId)).map(item => (new AnswerDocModel(item.docId, item.docDate, item.docloc, item.docLabel, item.highLighted)));
            }
            this.dataSourcePrihod.data = this.filterArray;
        } else {
            if (this.dataSource.length > this.dataSourcePrihod.data.length)
                this.dataSourcePrihod.data = this.dataSource;

            this.dataSourcePrihod.filter = filterValue.trim().toLowerCase();

            if (this.dataSourcePrihod.paginator) {
                this.dataSourcePrihod.paginator.firstPage();
            }
        }
    }

    applyFilterZpc(event: any) {
        let filterValue = event.target.value
        if (this.dataSource.length < this.dataSourceZpc.data.length)
            this.dataSource = this.dataSourceZpc.data;

        let arrStr = filterValue.split(' ');
        if (arrStr.length > 1) {
            if (this.dataSource.length > this.dataSourceZpc.data.length) {
                this.filterArray = this.dataSource.filter(item => arrStr.includes(item.docId)).map(item => (new AnswerDocModel(item.docId, item.docDate, item.docloc, item.docLabel, item.highLighted)));
            } else {
                this.filterArray = this.dataSourceZpc.data.filter(item => arrStr.includes(item.docId)).map(item => (new AnswerDocModel(item.docId, item.docDate, item.docloc, item.docLabel, item.highLighted)));
            }
            this.dataSourceZpc.data = this.filterArray;
        } else {
            if (this.dataSource.length > this.dataSourceZpc.data.length)
                this.dataSourceZpc.data = this.dataSource;

            this.dataSourceZpc.filter = filterValue.trim().toLowerCase();

            if (this.dataSourceZpc.paginator) {
                this.dataSourceZpc.paginator.firstPage();
            }
        }
    }

    applyFilterPerem(event: any) {
        let filterValue = event.target.value
        if (this.dataSource.length < this.dataSourcePerem.data.length)
            this.dataSource = this.dataSourcePerem.data;

        let arrStr = filterValue.split(' ');
        if (arrStr.length > 1) {
            if (this.dataSource.length > this.dataSourcePerem.data.length) {
                this.filterArray = this.dataSource.filter(item => arrStr.includes(item.docId)).map(item => (new AnswerDocModel(item.docId, item.docDate, item.docloc, item.docLabel, item.highLighted)));
            } else {
                this.filterArray = this.dataSourcePerem.data.filter(item => arrStr.includes(item.docId)).map(item => (new AnswerDocModel(item.docId, item.docDate, item.docloc, item.docLabel, item.highLighted)));
            }
            this.dataSourcePerem.data = this.filterArray;
        } else {
            if (this.dataSource.length > this.dataSourcePerem.data.length)
                this.dataSourcePerem.data = this.dataSource;

            this.dataSourcePerem.filter = filterValue.trim().toLowerCase();

            if (this.dataSourcePerem.paginator) {
                this.dataSourcePerem.paginator.firstPage();
            }
        }
    }

    applyFilterVozv(event: any) {
        let filterValue = event.target.value
        if (this.dataSource.length < this.dataSourceVozv.data.length)
            this.dataSource = this.dataSourceVozv.data;

        let arrStr = filterValue.split(' ');
        if (arrStr.length > 1) {
            this.filterArray = this.dataSourceVozv.data.filter(item => arrStr.includes(item.docId)).map(item => (new AnswerDocModel(item.docId, item.docDate, item.docloc, item.docLabel, item.highLighted)));

            this.dataSourceVozv.data = this.filterArray;
        } else {
            if (this.dataSource.length > this.dataSourceVozv.data.length)
                this.dataSourceVozv.data = this.dataSource;

            this.dataSourceVozv.filter = filterValue.trim().toLowerCase();

            if (this.dataSourceVozv.paginator) {
                this.dataSourceVozv.paginator.firstPage();
            }
        }
    }
} 