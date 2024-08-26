import { Component } from "@angular/core";
import { TokenService } from "../../../services/token.service";
import { MapService } from "../../../services/map.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { Location } from "@angular/common";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { CellBodyModel } from "../../../models/map-models/cell-answ";
import { TokenModel } from "../../../models/token";

@Component({
    selector: 'app-mini-map',
    templateUrl: './mini-map.component.html',
    styleUrl: './mini-map.component.scss',
    providers: [{
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
            subscriptSizing: 'dynamic'
        }
    }]
})
export class MiniMapComponent {
    constructor(
        private tokenService: TokenService,
        private mapServcie: MapService,
        private snackBarService: SnackbarService,
        private location: Location
    ) { }
    searchValue: string
    displayedColumns: string[] = ['article', 'barcode', 'name', 'count']
    dataSource: CellBodyModel[]
    searchPlace() {
        this.mapServcie.GetCell(new TokenModel(this.tokenService.getToken(), this.searchValue)).subscribe({
            next: result => {
                this.dataSource = result.body
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    inputHandler() {
        if (this.searchValue.includes('PLACE:'))
            this.searchValue.replaceAll('PLACE:', '')
    }
    Back() {
        this.location.back()
    }
}