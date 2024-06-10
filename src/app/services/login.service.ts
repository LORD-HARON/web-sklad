import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { HttpClient } from "@angular/common/http";
import { LoginQuery } from "../models/login-models/login-query";
import { LoginResponse } from "../models/login-models/login-response";
import { Observable } from "rxjs";
import { Status } from "../models/status";
import { Token } from "../models/token";
import { NewSkladUserModel } from "../models/login-models/new-sklad-user";
import { UpdateSkladUserModel } from "../models/login-models/update-sklad-user";

@Injectable({
    providedIn: "root"
})
export class LoginService {
    private urlLogin = environment.apiUrl + '/auth/'
    private addNewSkladUserUrl = environment.apiUrl + '/AddNewSkladUser/'
    private deleteSkladUserUrl = environment.apiUrl + '/DeleteSkladUser/'
    private updateSkladUserUrl = environment.apiUrl + '/UpdateSkladUser/'
    private authSkladUserUrl = environment.apiUrl + '/AuthSkladTsdUser/'

    constructor(
        private http: HttpClient
    ) { }

    getLogin(login: LoginQuery): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.urlLogin}`, login);
    }
    AddNewSkladUser(data: NewSkladUserModel): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.addNewSkladUserUrl, data)
    }
    DeleteSkladUser(data: NewSkladUserModel): Observable<Status> {
        return this.http.post<Status>(this.deleteSkladUserUrl, data)
    }
    UpdateSkladUser(data: UpdateSkladUserModel): Observable<Status> {
        return this.http.post<Status>(this.updateSkladUserUrl, data)
    }
    AuthSkladUser(data: LoginQuery): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.authSkladUserUrl, data)
    }
}