import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DocumentService } from "../../../services/document.service";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { TokenModel } from "../../../models/token";
import { ProcService } from "../../../services/proc.service";
import { BaseModel } from "../../../models/base-models/base";
import { DocData } from "../navbar.component/navbar.component";
@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrl: './base.component.scss'
})
export class BaseComponent implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private documentService: DocumentService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private dialog: MatDialog,
        private procService: ProcService
    ) { }
    @Input() data: DocData
    base: BaseModel[]
    ngOnInit(): void {
        this.getBase()
    }
    getBase() {
        this.documentService.GetDocBase(new TokenModel(this.tokenService.getToken(), String(this.data.docId), String(this.data.docName))).subscribe({
            next: response => {
                if (response) {
                    this.base = response
                }
                else
                    this.snackBarService.openSnackBar('Основание не найдено')
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar();
            }
        });
    }
}