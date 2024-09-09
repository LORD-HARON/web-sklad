import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../services/login.service";
import { AdaptiveService } from "../../services/adaptive.service";
import { Router } from "@angular/router";
import { LoginQuery } from "../../models/login-models/login-query";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TokenService } from "../../services/token.service";
import { SnackbarService } from "../../services/snackbar.service";
import { LoginResponse } from "../../models/login-models/login-response";
import { PersonalService } from "../../services/personal.service";

@Component({
    selector: "app-login",
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    constructor(
        private loginService: LoginService,
        private personalService: PersonalService,
        private adaptive: AdaptiveService,
        private router: Router,
        private tokenService: TokenService,
        private snackbarService: SnackbarService
    ) { }
    isLoginUser = false;
    inputType: string = 'password'
    userForm: FormGroup = new FormGroup({
        login: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
    })
    screenWidth: number
    login: string
    ngOnInit(): void {
        this.screenWidth = this.adaptive.GetCurrentWidth()
    }

    onClickLogin() {
        this.loginService.getLogin(new LoginQuery(this.userForm.value.login, this.userForm.value.password)).subscribe({
            next: response => {
                if (this.checkResponse(response)) {
                    this.tokenService.setCookie(response);
                    this.tokenService.logEvent(true);
                    this.router.navigate(['']);
                }
                else
                    this.snackbarService.openRedSnackBar("Неверный логин или пароль")
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar()
            }
        });
    }
    onClickTsdLogin() {
        let log = this.login.replace('U:', '')
        this.personalService.AuthSkladUser(new LoginQuery(log)).subscribe({
            next: response => {
                if (this.checkResponse(response)) {
                    this.tokenService.setCookie(response);
                    this.tokenService.logEvent(true);
                    this.router.navigate(['tsd/menu']);
                }
                else
                    this.snackbarService.openRedSnackBar("Не верный логин")
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar()
            }
        })
    }


    checkResponse(response: LoginResponse): boolean {
        if (response)
            if (response.token)
                if (response.token.length > 0)
                    return true;
                else return false;
            else return false;
        else return false;
    }
}