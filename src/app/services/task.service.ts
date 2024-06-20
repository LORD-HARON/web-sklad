import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { TokenModel } from "../models/token";
import { NewTaskModel } from "../models/task-models/new-task";
import { Observable } from "rxjs";
import { Status } from "../models/status";
import { MainTaskModel } from "../models/task-models/main-task";
import { CurrentTaskModel } from "../models/task-models/current-task";
import { PrintAnswModel } from "../models/task-models/print-answ";
import { RazgReqModel } from "../models/task-models/razg-req";
import { RazgAnswModel } from "../models/task-models/razg-answ";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    constructor(
        public http: HttpClient
    ) { }

    newTaskUrl = environment.apiUrl + '/NewTask/'
    getMainTaskUrl = environment.apiUrl + '/GetMainTask/'
    getCurrnetTaskUrl = environment.apiUrl + '/GetCurrentTask/'
    printComplateUrl = environment.apiUrl + '/PrintComplate/'
    razgUrl = environment.apiUrl + '/Razg/'

    NewTask(data: NewTaskModel): Observable<Status> {
        return this.http.post<Status>(this.newTaskUrl, data)
    }
    GetMainTask(data: TokenModel): Observable<MainTaskModel[]> {
        return this.http.post<MainTaskModel[]>(this.getMainTaskUrl, data)
    }
    GetCurrentTask(data: TokenModel): Observable<CurrentTaskModel[]> {
        return this.http.post<CurrentTaskModel[]>(this.getCurrnetTaskUrl, data)
    }
    PrintComplate(data: TokenModel): Observable<PrintAnswModel[]> {
        return this.http.post<PrintAnswModel[]>(this.printComplateUrl, data)
    }
    Razg(data: RazgReqModel): Observable<RazgAnswModel> {
        return this.http.post<RazgAnswModel>(this.razgUrl, data)
    }
}