import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DocumentService } from "../../../services/document.service";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FindInfoAnswModel } from "../../../models/documents-models/find-info-answ";
import { FindInfoReqModel } from "../../../models/documents-models/find-info-req";
import { AddProductModel } from "../../../models/documents-models/add-product";
import { TokenModel } from "../../../models/token";
import { FormControl, FormGroup } from "@angular/forms";
import { MapService } from "../../../services/map.service";
import { HostListener } from '@angular/core';
import { AddGSMModel } from "../../../models/documents-models/add-gsm-codes";
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
        route.params.subscribe(params => this.docName = params["docName"]);
    }
    docId: number
    docType: string
    docName: string
    barcode: string
    count: number
    numberInQueue: number = 1
    place: string
    showGSMConteiner: string = 'arrow_drop_down'
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
        this.documentService.FindInfo(new FindInfoReqModel(null, String(this.barcode), '19', '21', this.docId)).subscribe({
            next: result => {
                let input = document.getElementById('barcodeInput')!
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
    selectedPlace: string = ''
    selectPlaceItem(element: string) {
        this.selectedPlace = element
        if (this.docType == 'Ротация') {
            let place = this.inputForm.value.place == '' ? this.selectedPlace : this.inputForm.value.place!
            let placeTo = this.inputForm.value.place != '' ? this.selectedPlace : this.inputForm.value.placeTo!
            this.inputForm.setValue({
                place: place,
                count: this.inputForm.value.count!,
                number: this.inputForm.value.number!,
                placeTo: placeTo
            })
        }
        else {
            this.inputForm.setValue({
                place: this.selectedPlace,
                count: this.inputForm.value.count!,
                number: this.inputForm.value.number!,
                placeTo: ''
            })
        }

    }
    clearPlaceInput(element: number) {
        switch (element) {
            case 1:
                this.inputForm.setValue({
                    place: '',
                    count: this.inputForm.value.count!,
                    number: this.inputForm.value.number!,
                    placeTo: this.inputForm.value.placeTo!
                })
                break
            case 2:
                this.inputForm.setValue({
                    place: this.inputForm.value.place!,
                    count: this.inputForm.value.count!,
                    number: this.inputForm.value.number!,
                    placeTo: ''
                })
                break
        }
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
                            this.snackBarService.openSnackGreenBar('Добавлено')
                            this.barcode = ''
                            this.inputForm.setValue({
                                place: this.inputForm.value.place!,
                                count: null,
                                number: this.inputForm.value.number! + 1,
                                placeTo: ''
                            })
                            this.productInfo = this.clear
                            var input = document.getElementById('barcodeInput')
                            input!.focus()
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
        if (number.length >= 12) {
            this.GetProductInfo()
        }

    }
    openDocumentItems() {
        let type = this.docType
        let name = this.docName
        this.router.navigate(["tsd/document-items", this.docId, type, name])
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
    goBase() {
        let type = this.docType
        let name = this.docName
        this.router.navigate(['tsd/base', this.docId, type, name])
    }
    goGSM() {
        let type = this.docType
        let name = this.docName
        this.router.navigate(['tsd/gsm', this.docId, type, name])
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
    itemsCount: number = 0
    GetDocumentItems() {
        this.documentService.GetDocumentBody(new TokenModel(this.tokenService.getToken(), String(this.docId))).subscribe({
            next: result => {
                this.itemsCount = result.length
            },
            error: error => {
                console.log(error)
            }
        })
    }
    openAgreeDialog() {
        this.GetDocumentItems()
        const dialogRef = this.dialog.open(AgreeDialogComponent, { data: this.itemsCount })
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
    gsm: string
    inputAdd(event: any) {
        var number = event.target.value;
        if (number.length > 82) {
            this.addGSMCode()
        }
    }
    addGSMCode() {
        this.documentService.AddGSMCodes(new AddGSMModel(this.docId, this.productInfo.article, this.gsm)).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('GSM-код добавлен')
                        this.productInfo.gsm?.push(this.gsm)
                        this.gsm = ''
                        break;
                    case 'false':
                        this.snackBarService.openRedSnackBar('Данный код уже записан')
                        break;
                    case 'NULL':
                        this.snackBarService.openRedSnackBar('Пустой запрос')
                        break;
                }
            },
            error: error => {
                console.log(error);
            }
        })
    }
    deleteGSMCode(element: string) {
        this.documentService.DeleteGSMCode(new TokenModel(this.tokenService.getToken(), element)).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('GSM-код удален')
                        let index = this.productInfo.gsm?.findIndex(x => x == element)
                        if (index! > -1) {
                            this.productInfo.gsm?.splice(index!, 1)
                        }
                        break;
                    case 'NULL':
                        this.snackBarService.openRedSnackBar('Пустой запрос')
                        break;
                }
            },
            error: error => {
                console.log(error);
            }
        })
    }
}

@Component({
    templateUrl: './agree.dialog.component/agree.dialog.component.html',
})
export class AgreeDialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<AgreeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: number,
    ) { }
    closeDialog(element: string) {
        this.dialogRef.close(element)
    }
    ngOnInit(): void {
        this.data = this.data != null ? this.data : 0
    }
}