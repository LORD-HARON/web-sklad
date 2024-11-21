import { Component, Inject, OnInit } from "@angular/core";
import { TokenService } from "../../../../services/token.service";
import { ProductService } from "../../../../services/product.service";
import { SnackbarService } from "../../../../services/snackbar.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { StoreEditor } from "../../../../models/product-models/store-editor";
import { Status } from "../../../../models/status";

export interface DialogData {
    article: string;
    place: string,
    count: string,
    units: string,
}

@Component({
    selector: 'app-storage-places-editor',
    templateUrl: './storage-places-editor.component.html',
    styleUrl: './storage-places-editor.component.scss'
})
export class StoragePlacesEditorComponent implements OnInit {
    constructor(
        private tokenService: TokenService,
        private productService: ProductService,
        private snackbarService: SnackbarService,
        public dialogRef: MatDialogRef<StoragePlacesEditorComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    ngOnInit() {
        this.data;
    }

    onEdit() {
        this.productService.PutCountProduct(new StoreEditor(this.tokenService.getToken(), this.data.article, this.data.place, this.data.count)).subscribe({
            next: response => {
                if (response) {
                    this.checkResponse(response);
                }
            },
            error: error => {
                console.log(error);
                this.snackbarService.openRedSnackBar();
            }
        });
    }

    onNoClick(): void {
        this.dialogRef.close('false');
    }

    checkResponse(response: Status) {
        if (response.status === 'true') {
            this.snackbarService.openSnackBar('Количество изменено');
            this.dialogRef.close('true');
        }
        if (response.status === 'false') {
            this.snackbarService.openRedSnackBar('Ошибка измененния количества');
            this.onNoClick();
        }
    }
}