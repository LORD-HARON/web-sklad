import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environment";
import { Observable } from "rxjs";
import { ProductQueryModel } from "../models/product-models/product-query";
import { ProductResponceModel } from "../models/product-models/product-responce";
import { ProductPropQuery } from "../models/product-models/product-prop-query";
import { ProductPropAnswModel } from "../models/product-models/product-prop-answ";
import { StoreEditor } from "../models/product-models/store-editor";
import { Status } from "../models/status";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(
        public http: HttpClient
    ) { }

    getTreeUrl = environment.apiUrl + '/GetTree/'
    getProductUrl = environment.apiUrl + '/GetProduct/'
    getProductPropUrl = environment.apiUrl + '/GetProductProp/'
    putCountProductUrl = environment.apiUrl + '/PutCountProduct/'

    GetTree(): Observable<any> {
        return this.http.get<any>(this.getTreeUrl)
    }
    GetProduct(data: ProductQueryModel): Observable<ProductResponceModel[]> {
        return this.http.post<ProductResponceModel[]>(this.getProductUrl, data)
    }
    GetProductProp(data: ProductPropQuery): Observable<ProductPropAnswModel> {
        return this.http.post<ProductPropAnswModel>(this.getProductPropUrl, data)
    }
    PutCountProduct(data: StoreEditor): Observable<Status> {
        return this.http.post<Status>(this.putCountProductUrl, data)
    }
}