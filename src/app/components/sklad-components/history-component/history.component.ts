import { Component } from "@angular/core";
import { HistDataModel } from "../../../models/journal-models/history-answ";
import { MatTableDataSource } from "@angular/material/table";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { ProductService } from "../../../services/product.service";
import { JournalService } from "../../../services/journal.service";
import { HistFindModel } from "../../../models/journal-models/history-find";

@Component({
    selector: 'app-component',
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss'
})
export class HistoryComponent {

    constructor(
        private tokenService: TokenService,
        private journalService: JournalService,
        private snackBarService: SnackbarService
    ) { }
    searchValue: string
    searchParametr: string = 'article'
    dataSource: MatTableDataSource<HistDataModel>;
    displayedColumns: Array<string> = ['article', 'barcode', 'name', 'place', 'count', 'history'];

    searchData(article: string = '', place: string = '', worker: string = '') {
        this.journalService.GetHistory(new HistFindModel(this.tokenService.getToken(), article, place, worker)).subscribe({
            next: result => {
                console.log(result);

                this.dataSource = new MatTableDataSource(result.histData)
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    searchClick() {
        switch (this.searchParametr) {
            case 'article':
                this.searchData(this.searchValue)
                break;
            case 'place':
                this.searchData('', this.searchValue)
                break;
            case 'worker':
                this.searchData('', '', this.searchValue)
                break;
        }
    }
}