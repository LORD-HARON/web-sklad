import { Component } from "@angular/core";
import { TokenService } from "../../../services/token.service";
import { JournalService } from "../../../services/journal.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { HistDataModel } from "../../../models/journal-models/history-answ";
import { MatTableDataSource } from "@angular/material/table";
import { HistFindModel } from "../../../models/journal-models/history-find";
import { Location } from "@angular/common";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";

@Component({
    selector: 'app-article-history',
    templateUrl: './article-history.component.html',
    styleUrl: './article-history.component.scss',
    providers: [{
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
            subscriptSizing: 'dynamic'
        }
    }]
})
export class ArticleHistoryComponent {
    constructor(
        private tokenService: TokenService,
        private journalService: JournalService,
        private snackBarService: SnackbarService,
        private location: Location
    ) { }

    searchValue: string
    searchParametr: string = 'article'
    dataSource: MatTableDataSource<HistDataModel>;
    displayedColumns: Array<string> = ['article', 'barcode', 'place', 'count', 'history'];


    inputHandler() {
        if (this.searchValue.includes('PLACE:'))
            this.searchValue.replaceAll('PLACE:', '')
    }

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
    Back() {
        this.location.back()
    }
}