import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { HistFindModel } from "../models/journal-models/history-find";
import { Observable } from "rxjs";
import { HistAnswModel } from "../models/journal-models/history-answ";
import { JournalReqModel } from "../models/journal-models/journal-req";
import { JournalModel } from "../models/journal-models/journal";

@Injectable({
    providedIn: 'root'
})
export class JournalService {
    constructor(
        private http: HttpClient
    ) { }

    getHistoryUrl = environment.apiUrl + '/History/'
    getJournalUrl = environment.apiUrl + '/Journal/'

    GetHistory(data: HistFindModel): Observable<HistAnswModel> {
        return this.http.post<HistAnswModel>(this.getHistoryUrl, data)
    }
    GetJournal(data: JournalReqModel): Observable<JournalModel[]> {
        console.log(data);

        return this.http.post<JournalModel[]>(this.getJournalUrl, data)
    }
}