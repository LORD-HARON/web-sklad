import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DocumentService } from "../../../services/document.service";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FindInfoAnswModel } from "../../../models/documents-models/find-info-answ";
import { FindInfoReqModel } from "../../../models/documents-models/find-info-req";
import { AddProductModel } from "../../../models/documents-models/add-product";
import { TokenModel } from "../../../models/token";
import { FormControl, FormGroup } from "@angular/forms";
import { MapService } from "../../../services/map.service";

@Component({
    selector: 'app-work-space',
    templateUrl: './work-space.component.html',
    styleUrl: './work-space.component.scss'
})
export class WorkSpaceComponent {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private documentService: DocumentService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private dialog: MatDialog,
        private mapService: MapService
    ) {
        route.params.subscribe(params => this.docId = params["docId"]);
        route.params.subscribe(params => this.docType = params["docType"]);
    }
    docId: number
    docType: string
    barcode: string
    count: number
    numberInQueue: number = 1
    place: string
    productInfo: FindInfoAnswModel = new FindInfoAnswModel('', '', '', '', '', '', '', '', '', '')
    clear = new FindInfoAnswModel('', '', '', '', '', '', '', '', '', '')
    inputForm = new FormGroup({
        'place': new FormControl(''),
        'count': new FormControl(null),
        'number': new FormControl(1),
        'placeTo': new FormControl(''),
    })
    otherPosition: boolean = false
    showCountWarning: boolean = false
    GetProductInfo() {
        this.documentService.FindInfo(new FindInfoReqModel(null, String(this.barcode), '19', '21')).subscribe({
            next: result => {
                var input = document.getElementById('barcodeInput')!
                input.blur();
                console.log(result)
                if (result.article)
                    this.productInfo = result
                else
                    this.snackBarService.openRedSnackBar('Товар не найден');
                this.showCountWarning = false
            },
            error: error => {
                console.log(error)
            }
        })
    }
    AddProductToDoc() {
        let place = this.inputForm.value.place!.replace('PLACE:', '')
        let placeTo = this.inputForm.value.placeTo!.replace('PLACE:', '')
        place = this.docType == 'Ротация' ? `${place}-${placeTo}` : place
        if (this.productInfo.article) {
            let prod = new AddProductModel(this.tokenService.getToken(), '', this.docId, this.productInfo.article, this.productInfo.barcode, this.productInfo.name, this.inputForm.value.count!, place, this.inputForm.value.number!, this.productInfo.price, this.productInfo.img_url, this.otherPosition, this.productInfo.ukz)
            console.log(prod)
            this.documentService.AddProduct(prod).subscribe({
                next: result => {
                    switch (result.status) {
                        case 'true':
                            this.snackBarService.openSnackGreenBar('Добавлено');
                            this.barcode = ''
                            this.inputForm.setValue({
                                place: '',
                                count: null,
                                number: this.inputForm.value.number! + 1,
                                placeTo: ''
                            })
                            this.productInfo = this.clear
                            break;
                        case 'BadAuth':
                            this.snackBarService.openRedSnackBar('Токен устарел');
                            break;
                        case 'NULL':
                            this.snackBarService.openRedSnackBar('NULL');
                            break;
                        case 'error':
                            this.snackBarService.openRedSnackBar('Ошибка');
                            break;
                    }
                    this.showCountWarning = false
                },
                error: error => {
                    console.log(error)
                    this.snackBarService.openSnackGreenBar('Добавлено');
                }
            })
        } else
            this.snackBarService.openRedSnackBar('Отсканируйте ШК');

    }
    InputHandel(event: any) {
        var number = event.target.value;
        if (number.length >= 13) {
            this.GetProductInfo()
        }

    }
    openDocumentItems() {
        let type = this.docType
        this.router.navigate(["tsd/document-items", this.docId, type])
    }
    goBack() {
        this.router.navigate(['tsd/menu'])
    }
    goArticleHistory() {
        this.router.navigate(['tsd/article-hist'])
    }
    goMiniMap() {
        this.router.navigate(['tsd/mini-map'])
    }
    pushDoc() {
        this.documentService.PushDocument(new TokenModel(this.tokenService.getToken(), String(this.docId))).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Документ успешно отправлен на сервер');
                        this.router.navigate(['/tsd/menu'])
                        break;
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Токен устарел');
                        break;
                    case 'NULL':
                        this.snackBarService.openRedSnackBar('NULL');
                        break;
                    case 'error':
                        this.snackBarService.openRedSnackBar('Ошибка');
                        break;
                }
            },
            error: error => {
                console.log(error)
            }
        })
    }
    checkCount() {
        if ((this.docType == 'Ротация' || this.docType == 'Отборка') && this.productInfo.article) {
            let place = this.inputForm.value.place!.replace('PLACE:', '')
            this.mapService.CheckCount(new TokenModel(this.tokenService.getToken(), place, this.productInfo.article)).subscribe({
                next: result => {
                    switch (result.status) {
                        case 'true':
                            this.showCountWarning = false
                            break
                        case 'false':
                            this.showCountWarning = true
                            break
                        case 'error':
                            this.snackBarService.openRedSnackBar()
                            break
                        case 'BadAuth':
                            this.snackBarService.openRedSnackBar('Неверный токен')
                            break
                    }
                },
                error: error => {
                    console.log(error);
                    this.snackBarService.openRedSnackBar()
                }
            })
        }
    }
    openAgreeDialog() {
        const dialogRef = this.dialog.open(AgreeDialogComponent)
        dialogRef.afterClosed().subscribe(result => {
            switch (result) {
                case "true":
                    this.pushDoc();
                    break;
                case "false":
                    break;
            }
        });
    }
}

@Component({
    templateUrl: './agree.dialog.component/agree.dialog.component.html',
})
export class AgreeDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<AgreeDialogComponent>,
    ) { }
    closeDialog(element: string) {
        this.dialogRef.close(element)
    }
}