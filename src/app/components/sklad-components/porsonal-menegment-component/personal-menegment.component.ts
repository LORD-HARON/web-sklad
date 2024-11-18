import { Component, OnInit } from "@angular/core";
import { TokenService } from "../../../services/token.service";

@Component({
    selector: 'app-personal-menegment',
    templateUrl: './personal-menegment.component.html',
    styleUrl: './personal-menegment.component.scss'
})
export class PersonalMenegmentComponent implements OnInit {
    selectedTemp: string = 'users'
    constructor(
        private tokenService: TokenService
    ) { }
    login: string
    admin: boolean = false
    ngOnInit(): void {
        this.login = this.tokenService.getLogin();
        this.admin = this.tokenService.getIsAdmin() == 1 ? true : false
    }
}