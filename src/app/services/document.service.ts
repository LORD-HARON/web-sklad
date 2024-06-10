import { Injectable } from "@angular/core"
import { environment } from "../environment"
import { HttpClient } from "@angular/common/http"
import { CreateDocumentModel } from "../models/documents-models/create-document"
import { Observable } from "rxjs"
import { DocumentsListModel } from "../models/documents-models/documents-list"
import { Token } from "../models/token"
import { Status } from "../models/status"
import { FindInfoAnswModel } from "../models/documents-models/find-info-answ"
import { FindInfoReqModel } from "../models/documents-models/find-info-req"
import { AddProductModel } from "../models/documents-models/add-product"
import { DocumentBodyModel } from "../models/documents-models/document-body"
import { EditProductModel } from "../models/documents-models/edit-product"

@Injectable({
    providedIn: "root"
})
export class DocumentService {
    constructor(
        private http: HttpClient
    ) { }
    createDocumentURL = environment.apiUrl + '/CreateDoc'
    getDocumentListURL = environment.apiUrl + '/GetDocumentList'
    deleteDocumentURL = environment.apiUrl + '/DeleteDocument'
    getDocumentURL = environment.apiUrl + '/GetDocument'
    findInfoURL = environment.apiUrl + '/FindInfo'
    addProductURL = environment.apiUrl + '/AddProductToDoc'
    getDocumentBodyURL = environment.apiUrl + '/GetDocumentBody'
    deleteDocumentItemURL = environment.apiUrl + '/DeleteDocumentItem'
    editProductURL = environment.apiUrl + '/EditDocumentItem'
    pushDocumentURL = environment.apiUrl + '/PushDocument'
    CreateDocument(data: CreateDocumentModel): Observable<DocumentsListModel> {
        return this.http.post<DocumentsListModel>(this.createDocumentURL, data)
    }
    GetDocumentList(data: Token): Observable<DocumentsListModel[]> {
        return this.http.post<DocumentsListModel[]>(this.getDocumentListURL, data)
    }
    DeleteDocument(data: Token): Observable<Status> {
        return this.http.post<Status>(this.deleteDocumentURL, data)
    }
    GetDocument(data: Token): Observable<DocumentsListModel> {
        return this.http.post<DocumentsListModel>(this.getDocumentURL, data)
    }
    FindInfo(data: FindInfoReqModel): Observable<FindInfoAnswModel> {
        return this.http.post<FindInfoAnswModel>(this.findInfoURL, data)
    }
    AddProduct(data: AddProductModel): Observable<Status> {
        return this.http.post<Status>(this.addProductURL, data)
    }
    GetDocumentBody(data: Token): Observable<DocumentBodyModel[]> {
        return this.http.post<DocumentBodyModel[]>(this.getDocumentBodyURL, data)
    }
    DeleteDocumentItem(data: Token): Observable<Status> {
        return this.http.post<Status>(this.deleteDocumentItemURL, data)
    }
    EditProduct(data: EditProductModel): Observable<Status> {
        return this.http.post<Status>(this.editProductURL, data)
    }
    PushDocument(data: Token): Observable<Status> {
        return this.http.post<Status>(this.pushDocumentURL, data)
    }
}