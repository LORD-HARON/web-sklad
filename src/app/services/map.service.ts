import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { TokenModel } from "../models/token";
import { Observable } from "rxjs";
import { StillagesModel } from "../models/map-models/stillages";
import { HttpClient } from "@angular/common/http";
import { Status } from "../models/status";
import { CellAnswModel } from "../models/map-models/cell-answ";

@Injectable({
    providedIn: "root"
})
export class MapService {
    constructor(
        private http: HttpClient
    ) { }
    getStillagesUrl = environment.apiUrl + '/GetStillages/'
    setStillagesUrl = environment.apiUrl + '/SetStillages/'
    getCellUrl = environment.apiUrl + '/GetCell/'
    checkCountURL = environment.apiUrl + '/CheckCount/'

    GetSklad(data: TokenModel): Observable<StillagesModel> {
        return this.http.post<StillagesModel>(this.getStillagesUrl, data)
    }
    SetSklad(data: TokenModel): Observable<Status> {
        return this.http.post<Status>(this.setStillagesUrl, data)
    }
    GetCell(data: TokenModel): Observable<CellAnswModel> {
        return this.http.post<CellAnswModel>(this.getCellUrl, data)
    }
    CheckCount(data: TokenModel): Observable<Status> {
        return this.http.post<Status>(this.checkCountURL, data)
    }
}