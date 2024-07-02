import { Component } from "@angular/core";
import { TokenService } from "../../../services/token.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
    constructor(
        private tokenService: TokenService,
        private router: Router
    ) { }
    logOut() {
        this.tokenService.deleteCookie();
        this.router.navigate(['/login']);
    }
}