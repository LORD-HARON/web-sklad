import { Component } from "@angular/core";
import { FindInfoAnswModel } from "../../../models/documents-models/find-info-answ";
import { Router } from "@angular/router";
import { LoginService } from "../../../services/login.service";
import { DocumentService } from "../../../services/document.service";
import { TokenService } from "../../../services/token.service";
import { FindInfoReqModel } from "../../../models/documents-models/find-info-req";

export interface StoreListModel {
    storeloc: number,
    price_type: number,
    name: string
}
@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrl: './info.component.scss'
})
export class InfoComponent {
    constructor(
        private router: Router,
        private loginService: LoginService,
        private documentService: DocumentService,
        private tokenService: TokenService,
    ) {
    }
    storeList: StoreListModel[] = [
        { storeloc: 8, price_type: 3, name: 'Долгиновский' },
        { storeloc: 11, price_type: 4, name: 'Брест' },
        { storeloc: 18, price_type: 6, name: 'Паритизанский' },
        { storeloc: 21, price_type: 7, name: 'Тимирязева' },
        { storeloc: 22, price_type: 8, name: 'Каменогорская' },
        { storeloc: 24, price_type: 10, name: 'Независимости' },
        { storeloc: 25, price_type: 11, name: 'Молодечно' },
        { storeloc: 31, price_type: 17, name: 'Дайманд' },
        { storeloc: 32, price_type: 18, name: 'Outleto' },
        { storeloc: 33, price_type: 19, name: 'Гродно' },
        { storeloc: 34, price_type: 20, name: 'Expobel' },
        { storeloc: 35, price_type: 22, name: 'Горецкого' },
    ]
    selectedStore: number = 8
    image: string

    article: string
    barcode: string
    info: FindInfoAnswModel = new FindInfoAnswModel('', '', '', '', '', '', '', '', '')
    clear = new FindInfoAnswModel('', '', '', '', '', '', '', '', '')

    ngOnInit(): void {
    }
    inputHandleBarcode(event: any) {
        var number = event.target.value;
        if (number.length >= 13) {
            this.FindInfo()
        }
    }
    inputHandleArticle(event: any) {
        var number = event.target.value;
        if (number.length >= 6) {
            this.FindInfo()
        }
    }
    FindInfo() {
        let req = new FindInfoReqModel(this.article ? this.article : null, this.barcode ? this.barcode : null!)
        this.documentService.FindInfo(req).subscribe({
            next: res => {
                var inputArticle = document.getElementById('inputArticle')!
                var inputBarcode = document.getElementById('inputBarcode')!
                inputArticle.blur()
                inputBarcode.blur()
                this.info = res
                this.article = res.article
                this.barcode = res.barcode
                console.log(this.info)
            },
            error: error => {
                console.log(error)
            }
        })
    }

    allClear() {
        this.info = this.clear
        this.article = null!
        this.barcode = null!
    }
    goBack() {
        this.router.navigate(['/tsd/menu'])
    }
    goMore() {
        window.location.href = `https://mile.by/search/?q=${this.info.article}`;
    }
}