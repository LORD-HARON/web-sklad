import { Component, Inject, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DocumentService } from "../../../services/document.service";
import { TokenService } from "../../../services/token.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FindInfoAnswModel } from "../../../models/documents-models/find-info-answ";
import { FindInfoReqModel } from "../../../models/documents-models/find-info-req";
import { AddProductModel } from "../../../models/documents-models/add-product";
import { TokenModel } from "../../../models/token";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MapService } from "../../../services/map.service";
import { HostListener } from '@angular/core';
import { AddGSMModel } from "../../../models/documents-models/add-gsm-codes";
import { DocumentBodyModel } from "../../../models/documents-models/document-body";
import { NewAddProductModel, PlacesModel } from "../../../models/documents-models/new-add-product";
interface DocData {
    docId: number,
    docType: string,
    docName: string
}
@Component({
    selector: 'app-work-space',
    templateUrl: './work-space.component.html',
    styleUrl: './work-space.component.scss'
})
export class WorkSpaceComponent implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private documentService: DocumentService,
        private tokenService: TokenService,
        private snackBarService: SnackbarService,
        private dialog: MatDialog,
        private mapService: MapService,
        private formBuilder: FormBuilder
    ) { }

    @Input() data: DocData
    article: string
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
    GetProductInfo(type: string) {
        console.log(String(this.barcode));

        let data = type == 'barcode'
            ? new FindInfoReqModel(null, String(this.barcode), '19', '21', this.data.docId)
            : new FindInfoReqModel(this.article, null, '19', '21', this.data.docId)
        this.documentService.FindInfo(data).subscribe({
            next: result => {
                let input = document.getElementById('articleInput')!
                let input1 = document.getElementById('barcodeInput')!
                if (result.barcode.length <= 12) {
                    input.blur()
                    input1.blur()
                }
                if (result.article) {
                    this.productInfo = result
                    this.article = this.productInfo.article
                    this.barcode = this.productInfo.barcode
                    if (this.data.docType != 'Приемка' && this.data.docType != 'Импорт')
                        this.initForm()
                    else {
                        this.productForm.get('numb')?.setValue('')
                        this.places.controls.forEach(x => {
                            x.get('count')?.setValue('')
                        })
                    }
                }
                else
                    this.snackBarService.openRedSnackBar('Товар не найден');
                this.showCountWarning = false
            },
            error: error => {
                console.log(error)
            }
        })
    }
    clearProductInfo() {
        this.article = ''
        this.barcode = ''
        this.productInfo = this.clear
        this.initForm()
    }
    showingPlaceSelector(): boolean {
        if (this.productInfo.places)
            return this.productInfo.places!.length == 0 ? false : true
        return false
    }
    selectedPlace: string = ''
    selectPlaceItem(element: string, index: number) {
        if (this.data.docType == "Ротация") {
            this.places.value[index].place != '' ? this.places.controls[index].get('placeTo')?.setValue(element) : this.places.value[index].placeTo
            this.places.value[index].place == '' ? this.places.controls[index].get('place')?.setValue(element) : this.places.value[index].place
        } else
            this.places.controls[index].get('place')?.setValue(element)
        // this.selectedPlace = element
        // if (this.data.docType == 'Ротация') {
        //     let place = this.inputForm.value.place == '' ? this.selectedPlace : this.inputForm.value.place!
        //     let placeTo = this.inputForm.value.place != '' ? this.selectedPlace : this.inputForm.value.placeTo!
        //     this.inputForm.setValue({
        //         place: place,
        //         count: this.inputForm.value.count!,
        //         number: this.inputForm.value.number!,
        //         placeTo: placeTo
        //     })
        // }
        // else {
        //     this.inputForm.setValue({
        //         place: this.selectedPlace,
        //         count: this.inputForm.value.count!,
        //         number: this.inputForm.value.number!,
        //         placeTo: ''
        //     })
        // }

    }
    // clearPlaceInput(element: number) {
    //     switch (element) {
    //         case 1:
    //             this.inputForm.setValue({
    //                 place: '',
    //                 count: this.inputForm.value.count!,
    //                 number: this.inputForm.value.number!,
    //                 placeTo: this.inputForm.value.placeTo!
    //             })
    //             break
    //         case 2:
    //             this.inputForm.setValue({
    //                 place: this.inputForm.value.place!,
    //                 count: this.inputForm.value.count!,
    //                 number: this.inputForm.value.number!,
    //                 placeTo: ''
    //             })
    //             break
    //     }
    // }
    ngOnInit(): void {
        this.initForm()
    }
    productForm: FormGroup
    private initForm() {
        this.productForm = this.formBuilder.group({
            places: this.formBuilder.array([this.getPlaces()]),
            numb: []
        })
    }
    private getPlaces() {
        return this.formBuilder.group({
            place: '',
            count: '',
            placeTo: '',
            warn: false
        })
    }

    get places() {
        return this.productForm.get("places") as FormArray
    }

    removePlace(index: number) {
        this.places.removeAt(index)
    }

    addPlace() {
        this.places.push(this.getPlaces())
    }
    NewCheckCount(index: number) {
        if ((this.data.docType == 'Ротация' || this.data.docType == 'Отборка') && this.productInfo.article) {
            let place = this.places.value[index].place!.replace('PLACE:', '')
            this.mapService.CheckCount(new TokenModel(this.tokenService.getToken(), place, this.productInfo.article)).subscribe({
                next: result => {
                    switch (result.status) {
                        case 'true':
                            this.places.controls[index].get('warn')?.setValue(false)
                            break
                        case 'false':
                            this.places.controls[index].get('warn')?.setValue(true)
                            break
                        case 'error':
                            this.places.controls[index].get('warn')?.setValue(false)
                            break
                        case 'NULL':
                            this.places.controls[index].get('warn')?.setValue(true)
                            break
                        case 'BadAuth':
                            this.places.controls[index].get('warn')?.setValue(false)
                            this.snackBarService.openRedSnackBar('Неверный токен')
                            break
                    }
                },
                error: error => {
                    console.log(error);
                    this.showCountWarning = false
                    this.snackBarService.openRedSnackBar()
                }
            })
        }
    }
    CheckCellBarcode(index: number) {
        let place = this.places.value[index].place!.replace('PLACE:', '')
        this.places.controls[index].get('place')?.setValue(place)
    }
    NewAddProductToDoc() {
        let check = this.places.value.find((x: any) => {
            if (x.place == '' || x.count == '' || (this.data.docType == 'Ротация' && x.placeTo == ''))
                return x
        })
        if (this.productInfo.article && !check) {
            let places: PlacesModel[] = []
            this.places.value.forEach((element: any) => {
                if (this.data.docType == 'Ротация')
                    places.push(new PlacesModel(0, `${element.place}-${element.placeTo}`, element.count, 0))
                places.push(new PlacesModel(0, element.place, element.count, 0))
            })
            let prod = new NewAddProductModel(this.tokenService.getToken(), '', Number(this.data.docId), this.productInfo.article, this.productInfo.barcode, this.productInfo.name, places, Number(this.productForm.value.numb), this.productInfo.price, this.productInfo.img_url, this.otherPosition, this.productInfo.ukz)
            this.documentService.NewAddProductToDoc(prod).subscribe({
                next: result => {
                    switch (result.status) {
                        case 'true':
                            this.snackBarService.openSnackGreenBar('Добавлено')
                            this.barcode = ''
                            this.article = ''
                            this.productInfo = this.clear
                            if (this.data.docType != 'Приемка' && this.data.docType != 'Импорт')
                                this.initForm()
                            else {
                                this.productForm.get('numb')?.setValue('')
                                this.places.controls.forEach(x => {
                                    x.get('count')?.setValue('')
                                })
                            }

                            this.sumCount = 0
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
                },
                error: error => {
                    console.log(error);
                }
            })
        }
        else
            this.snackBarService.openRedSnackBar('Заполните поля');
    }

    AddProductToDoc() {
        let place = this.inputForm.value.place!.replace('PLACE:', '')
        let placeTo = this.inputForm.value.placeTo!.replace('PLACE:', '')
        place = this.data.docType == 'Ротация' ? `${place}-${placeTo}` : place
        if (this.productInfo.article && place && this.inputForm.value.count) {
            let prod = new AddProductModel(this.tokenService.getToken(), '', this.data.docId, this.productInfo.article, this.productInfo.barcode, this.productInfo.name, this.inputForm.value.count!, place, this.inputForm.value.number!, this.productInfo.price, this.productInfo.img_url, this.otherPosition, this.productInfo.ukz)
            this.documentService.AddProduct(prod).subscribe({
                next: result => {
                    switch (result.status) {
                        case 'true':
                            this.snackBarService.openSnackGreenBar('Добавлено')
                            this.barcode = ''
                            this.article = ''
                            // this.inputForm.setValue({
                            //     place: this.inputForm.value.place!,
                            //     count: null,
                            //     number: null,
                            //     placeTo: ''
                            // })
                            this.productInfo = this.clear
                            this.initForm()
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
            this.snackBarService.openRedSnackBar('Заполните поля');
    }
    InputHandel(event: any) {
        var number = event.target.value;
        if (number.length >= 12) {
            this.GetProductInfo('barcode')
        }
    }

    checkCount() {
        if ((this.data.docType == 'Ротация' || this.data.docType == 'Отборка') && this.productInfo.article) {
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
                            this.showCountWarning = false
                            break
                        case 'NULL':
                            this.showCountWarning = false
                            break
                        case 'BadAuth':
                            this.showCountWarning = false
                            this.snackBarService.openRedSnackBar('Неверный токен')
                            break
                    }
                },
                error: error => {
                    console.log(error);
                    this.showCountWarning = false
                    this.snackBarService.openRedSnackBar()
                }
            })
        }
    }

    gsm: string
    inputAdd(event: any) {
        var number = event.target.value;
        if (number.length > 82) {
            this.addGSMCode()
        }
    }
    addGSMCode() {
        this.documentService.AddGSMCodes(new AddGSMModel(this.data.docId, this.productInfo.article, this.gsm)).subscribe({
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
    AutoSearchArticle(event: any) {
        var number = event.target.value;
        if (number.length >= 7) {
            this.GetProductInfo('article')
        }
    }
    sumCount: number = 0
    SumCount() {
        this.sumCount = 0
        this.places.value.forEach((element: any) => {
            this.sumCount += Number(element.count)
        });
    }
}