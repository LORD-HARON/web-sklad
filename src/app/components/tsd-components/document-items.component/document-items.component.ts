import { Component, Input, input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TokenService } from "../../../services/token.service";
import { DocumentService } from "../../../services/document.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { TokenModel } from "../../../models/token";
import { EditProductModel } from "../../../models/documents-models/edit-product";
import { DocumentBodyModel } from "../../../models/documents-models/document-body";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { DocData } from "../navbar.component/navbar.component";
import { DocumentBodyAnswerModel } from "../../../models/documents-models/document-body-answer";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { PlacesModel } from "../../../models/documents-models/new-add-product";
import { MapService } from "../../../services/map.service";
interface Places {
    id: number,
    place: string,
    count: number,
    placeTo: string
    warn: boolean
}
@Component({
    selector: 'app-document-items',
    templateUrl: './document-items.component.html',
    styleUrl: './document-items.component.scss',
    providers: [{
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
            subscriptSizing: 'dynamic'
        }
    }]
})

export class DocumentItemsComponent {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private tokenService: TokenService,
        private documentService: DocumentService,
        private snackBarService: SnackbarService,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private mapService: MapService
    ) { }
    @Input() data: DocData
    items: DocumentBodyAnswerModel[] = []
    showingItems: DocumentBodyAnswerModel[] = []
    totalPrice: number = 0
    ngOnInit(): void {
        this.GetDocumentItems()
        this.initForm()
    }

    searchRow: string
    productForm: FormGroup

    private initForm() {
        this.productForm = this.formBuilder.group({
            places: this.formBuilder.array([]),
            numb: ['']
        })
    }
    private getInitPlaces() {
        return this.formBuilder.group({
            place: '',
            count: '',
            placeTo: '',
            warn: false
        })
    }
    private getPlaces(data: Places) {
        return this.formBuilder.group({
            id: data.id,
            place: data.place,
            count: data.count,
            placeTo: data.placeTo,
            warn: data.warn
        })
    }

    get places() {
        return this.productForm.get("places") as FormArray
    }

    removePlace(index: number) {
        this.places.removeAt(index)
    }

    addPlace(data: PlacesModel[]) {
        let place: Places[] = []
        data.forEach(x => place.push({ id: x.id, place: x.cell, count: x.count_e, placeTo: '', warn: false }))
        place.forEach(x => this.places.push(this.getPlaces(x)))
    }
    addNewPlace() {
        this.places.push(this.getInitPlaces())
    }
    FilterItems() {
        this.showingItems = this.items.filter(i => i.article.includes(this.searchRow) || i.name.includes(this.searchRow) || i.barcode.includes(this.searchRow))
    }
    filterCansel() {
        this.showingItems = this.items
        this.searchRow = ''
    }
    GetDocumentItems() {
        this.documentService.GetDocumentBody(new TokenModel(this.tokenService.getToken(), String(this.data.docId))).subscribe({
            next: result => {
                this.items = result
                this.showingItems = result
                console.log(result);
            },
            error: error => {
                console.log(error)
            }
        })
    }

    DeleteItem(element: string) {
        this.documentService.DeleteDocumentItem(new TokenModel(this.tokenService.getToken(), element, String(this.data.docId))).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Удалено');
                        this.GetDocumentItems()
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
                this.snackBarService.openRedSnackBar();
            }
        })
    }

    DeleteItemPlace(index: number) {
        this.documentService.DeleteDocumentItemPlace(new TokenModel(this.tokenService.getToken(), String(this.places.value[index].id))).subscribe({
            next: result => {
                switch (result.status) {
                    case 'true':
                        this.snackBarService.openSnackGreenBar('Ячейка удалена');
                        this.removePlace(index)
                        break;
                    case 'BadAuth':
                        this.snackBarService.openRedSnackBar('Токен устарел');
                        break;
                    case 'NULL':
                        this.snackBarService.openSnackGreenBar('Ячейка удалена');
                        break;
                    case 'error':
                        this.snackBarService.openRedSnackBar('Ошибка');
                        break;
                }
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }
    switchEdit: boolean = false
    editItem: string
    count: number
    numb: number
    place: string

    NewEditItem(docItem: DocumentBodyAnswerModel) {
        if (this.switchEdit == false) {
            this.initForm()
            let item = this.showingItems.find(x => x.article == docItem.article)
            this.addPlace(item?.places!)
            this.productForm.get('numb')?.setValue(item?.numb)
            this.switchEdit = !this.switchEdit
            this.editItem = docItem.article
        } else {
            let editedPlaces: PlacesModel[] = []
            this.places.value.forEach((element: any) => {
                editedPlaces.push(new PlacesModel(element.id, element.place, element.count, 0))
            })
            let data = new EditProductModel(this.tokenService.getToken(), this.data.docId, docItem.article, docItem.barcode, docItem.name, docItem.price, docItem.imgUrl, docItem.ukz, editedPlaces, this.productForm.value.numb)
            this.documentService.EditProduct(data).subscribe({
                next: result => {
                    switch (result.status) {
                        case 'true':
                            this.snackBarService.openSnackGreenBar('Сохранено');
                            this.GetDocumentItems()
                            this.switchEdit = !this.switchEdit
                            this.editItem = ''
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
                    this.snackBarService.openRedSnackBar()
                }
            })
        }
    }
    NewCheckCount(index: number, article: string) {
        if ((this.data.docType == 'Ротация' || this.data.docType == 'Отборка') && article) {
            let place = this.places.value[index].place!.replace('PLACE:', '')
            this.mapService.CheckCount(new TokenModel(this.tokenService.getToken(), place, article)).subscribe({
                next: result => {
                    console.log(result.status);
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
                    this.snackBarService.openRedSnackBar()
                }
            })
        }
    }
    // EditItem(element: string, count?: string, numb?: number, place?: string) {
    // if (this.switchEdit === false) {
    //     this.switchEdit = !this.switchEdit
    //     this.editItem = element
    //     this.count = Number(count)
    //     this.numb = numb!
    //     this.place = place!
    // } else {
    //     this.documentService.EditProduct(new EditProductModel(this.tokenService.getToken(), element, this.count, this.numb, this.place)).subscribe({
    //         next: result => {
    //             switch (result.status) {
    //                 case 'true':
    //                     this.snackBarService.openSnackGreenBar('Сохранено');
    //                     this.GetDocumentItems()
    //                     this.switchEdit = !this.switchEdit
    //                     this.editItem = ''
    //                     break;
    //                 case 'BadAuth':
    //                     this.snackBarService.openRedSnackBar('Токен устарел');
    //                     break;
    //                 case 'NULL':
    //                     this.snackBarService.openRedSnackBar('NULL');
    //                     break;
    //                 case 'error':
    //                     this.snackBarService.openRedSnackBar('Ошибка');
    //                     break;
    //             }
    //         },
    //         error: error => {
    //             console.log(error)
    //             this.snackBarService.openRedSnackBar();
    //         }
    //     })
    // }
    // }

}