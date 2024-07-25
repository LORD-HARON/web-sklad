import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { JournalModel } from "../../../models/journal-models/journal";
import { JournalService } from "../../../services/journal.service";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { formatDate } from "@angular/common";
import { JournalReqModel } from "../../../models/journal-models/journal-req";
import { MatSort } from "@angular/material/sort";

@Component({
    selector: 'app-journal',
    templateUrl: './journal.component.html',
    styleUrl: './journal.component.scss'
})
export class JournalComponent implements OnInit {
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    startDate: Date = new Date()
    finishDate: Date = new Date()
    dataList: MatTableDataSource<JournalModel>
    displayedColumns: Array<string> = ['article', 'err_date', 'place', 'count_e', 'message'];
    constructor(
        private journalService: JournalService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService
    ) { }
    ngOnInit(): void {
        this.loadData(new JournalReqModel(this.tokenService.getToken(), formatDate(this.startDate, 'dd.MM.yyyy', 'en-US'), formatDate(this.finishDate, 'dd.MM.yyyy', 'en-US')))
    }
    loadData(req: JournalReqModel) {
        this.journalService.GetJournal(req).subscribe({
            next: result => {
                console.log(result);

                this.dataList = new MatTableDataSource(result)
                this.dataList.sort = this.sort;
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    onSearch() {
        if (this.finishDate < this.startDate)
            this.snackBarService.openRedSnackBar();
        else
            this.loadData(new JournalReqModel(this.tokenService.getToken(), formatDate(this.startDate, 'dd.MM.yyyy', 'en-US'), formatDate(this.finishDate, 'dd.MM.yyyy', 'en-US')))
    }
    applyFilter(event: any) {
        let filter = event.target.value
        this.dataList.filter = filter.trim().toLowerCase();
    }
}