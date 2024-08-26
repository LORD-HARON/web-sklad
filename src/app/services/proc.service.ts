import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { TokenModel } from "../models/token";
import { Observable } from "rxjs";
import { AnswerDocModel } from "../models/proc-models/answer-doc";
import { WDocAnswerModel } from "../models/proc-models/wdoc-answ";
import { Status } from "../models/status";

@Injectable({
    providedIn: 'root'
})
export class ProcService {
    constructor(
        private http: HttpClient
    ) { }

    getPrihodUrl = environment.apiUrl + '/GetPrihod/'
    getZPCUrl = environment.apiUrl + '/GetZPC/'
    getPeremUrl = environment.apiUrl + '/GetPerem/'
    getVozvUrl = environment.apiUrl + '/GetVozv/'
    getDocUrl = environment.apiUrl + '/GetDoc/'
    checkDocumentURl = environment.apiUrl + '/CheckDocument/'

    GetPrihod(data: TokenModel): Observable<AnswerDocModel[]> {
        return this.http.post<AnswerDocModel[]>(this.getPrihodUrl, data)
    }
    GetZPC(data: TokenModel): Observable<AnswerDocModel[]> {
        return this.http.post<AnswerDocModel[]>(this.getZPCUrl, data)
    }
    GetPerem(data: TokenModel): Observable<AnswerDocModel[]> {
        return this.http.post<AnswerDocModel[]>(this.getPeremUrl, data)
    }
    GetVozv(data: TokenModel): Observable<AnswerDocModel[]> {
        return this.http.post<AnswerDocModel[]>(this.getVozvUrl, data)
    }
    GetDoc(data: TokenModel): Observable<WDocAnswerModel> {
        return this.http.post<WDocAnswerModel>(this.getDocUrl, data)
    }
    CheckDocument(data: TokenModel): Observable<Status> {
        return this.http.post<Status>(this.checkDocumentURl, data)
    }
}