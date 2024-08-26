import { Component, OnInit } from "@angular/core";
import { SnackbarService } from "../../../services/snackbar.service";
import { PersonalService } from "../../../services/personal.service";
import { TokenService } from "../../../services/token.service";
import { MotivationQueryModel } from "../../../models/personal-models/motivation-query";
import { formatDate } from "@angular/common";
import { MotivationAnswModel } from "../../../models/personal-models/motivation-answ";
import { MotivationModel } from "../../../models/personal-models/motivation";
import { pipe } from "rxjs";

@Component({
    selector: 'app-worker-stat',
    templateUrl: './worker-stat.component.html',
    styleUrl: './worker-stat.component.scss'
})
export class WorkerStatComponent implements OnInit {
    startDate: Date = new Date()
    finishDate: Date = new Date()

    todayData: MotivationModel[]
    getTodayData: boolean = false
    dataByDate: MotivationModel[]

    constructor(
        private snackBarService: SnackbarService,
        private personalService: PersonalService,
        private tokenService: TokenService,
    ) { }
    ngOnInit(): void {
        this.getData()
    }
    getData() {
        let startDate = formatDate(this.startDate, 'dd.MM.yyyy 00:00:00', 'en-US')
        let finishDate = formatDate(this.finishDate, 'dd.MM.yyyy 23:59:59', 'en-US')
        this.personalService.GetMotivation(new MotivationQueryModel(this.tokenService.getToken(), startDate, finishDate, this.tokenService.getLogin())).subscribe({
            next: result => {
                if (this.getTodayData == false) {
                    this.getTodayData = true
                    result.forEach(i => {
                        this.todayData = i.motivation
                    })
                }
                else
                    result.forEach(i => {
                        this.dataByDate = i.motivation
                    })
            },
            error: error => {
                console.log(error);
            }
        })
    }
}