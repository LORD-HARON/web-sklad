import { Component, Inject } from "@angular/core";
import { TokenService } from "../../../../services/token.service";
import { ProductService } from "../../../../services/product.service";
import { SnackbarService } from "../../../../services/snackbar.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProductResponceModel } from "../../../../models/product-models/product-responce";

export interface DialogData {
    productList: ProductResponceModel,
    placeList: Array<string>,
}

export interface DataPlace {
    num: number,
    place: string,
    count: string,
}

@Component({
    selector: 'app-place-form-list',
    templateUrl: './place-list-form.component.html',
    styleUrl: './place-list-form.component.scss'
})
export class PlaceListFormComponennt {
    displayedColumnsProduct = ['Артикул', 'Наименование', 'Тип', 'Штрихкод', 'Ос.склад', 'Ос.брак']
    displayedColumnsPlaces = ['№', 'Места хранения', 'Количество']
    dataPlace: Array<DataPlace> = [];

    constructor(
        private tokenService: TokenService,
        private productService: ProductService,
        private snackbarService: SnackbarService,
        public dialogRef: MatDialogRef<PlaceListFormComponennt>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }


    ngOnInit() {
        this.data.placeList;
        console.log(this.data);

        let i = 1;
        this.dataPlace = this.data.placeList.map(item => ({
            num: i++,
            place: item.split(' | ')[0],
            count: item.split(' | ')[1],
        }));
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}