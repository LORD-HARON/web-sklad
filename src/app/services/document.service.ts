import { Injectable } from "@angular/core"
import { environment } from "../environment"
import { HttpClient } from "@angular/common/http"
import { CreateDocumentModel } from "../models/documents-models/create-document"
import { Observable } from "rxjs"
import { DocumentsListModel } from "../models/documents-models/documents-list"
import { TokenModel } from "../models/token"
import { Status } from "../models/status"
import { FindInfoAnswModel } from "../models/documents-models/find-info-answ"
import { FindInfoReqModel } from "../models/documents-models/find-info-req"
import { AddProductModel } from "../models/documents-models/add-product"
import { DocumentBodyModel } from "../models/documents-models/document-body"
import { EditProductModel } from "../models/documents-models/edit-product"
import { E } from "@angular/cdk/keycodes"
import { BaseModel } from "../models/base-models/base"
import { AddGSMModel } from "../models/documents-models/add-gsm-codes"
import { GSMModel } from "../models/documents-models/gsm"
import { GetGSMModel } from "../models/documents-models/get-gsm"
import { CheckDocumentModel } from "../models/documents-models/check-documen"
import { Token } from "@angular/compiler"

@Injectable({
    providedIn: "root"
})
export class DocumentService {
    constructor(
        private http: HttpClient
    ) { }
    createDocumentURL = environment.apiUrl + '/CreateDoc'
    checkDocumentURL = environment.apiUrl + '/CheckDoc'
    getDocumentListURL = environment.apiUrl + '/GetDocumentList'
    deleteDocumentURL = environment.apiUrl + '/DeleteDocument'
    getDocumentURL = environment.apiUrl + '/GetDocument'
    findInfoURL = environment.apiUrl + '/FindInfo'
    addProductURL = environment.apiUrl + '/AddProductToDoc'
    getDocumentBodyURL = environment.apiUrl + '/GetDocumentBody'
    deleteDocumentItemURL = environment.apiUrl + '/DeleteDocumentItem'
    editProductURL = environment.apiUrl + '/EditDocumentItem'
    pushDocumentURL = environment.apiUrl + '/PushDocument'
    getMyDocsURL = environment.apiUrl + '/GetMyDocs'
    generateFilesURL = environment.apiUrl + '/GenerateFiles'
    getDocBaseurl = environment.apiUrl + '/GetDocBase'
    addGSMCodesURL = environment.apiUrl + '/AddGSMCodes'
    deleteGSMCodeURL = environment.apiUrl + '/DeleteGSMCode'
    getGSMCodesURL = environment.apiUrl + '/GetGSMCodes'
    clearGSMURL = environment.apiUrl + '/ClearGSM'

    CreateDocument(data: CreateDocumentModel): Observable<DocumentsListModel> {
        return this.http.post<DocumentsListModel>(this.createDocumentURL, data)
    }
    CheckDocument(data: CreateDocumentModel): Observable<CheckDocumentModel | null> {
        return this.http.post<CheckDocumentModel | null>(this.checkDocumentURL, data)
    }
    GetDocumentList(data: TokenModel): Observable<DocumentsListModel[]> {
        return this.http.post<DocumentsListModel[]>(this.getDocumentListURL, data)
    }
    DeleteDocument(data: TokenModel): Observable<Status> {
        console.log(data);

        return this.http.post<Status>(this.deleteDocumentURL, data)
    }
    GetDocument(data: TokenModel): Observable<DocumentsListModel> {
        return this.http.post<DocumentsListModel>(this.getDocumentURL, data)
    }
    FindInfo(data: FindInfoReqModel): Observable<FindInfoAnswModel> {
        return this.http.post<FindInfoAnswModel>(this.findInfoURL, data)
    }
    AddProduct(data: AddProductModel): Observable<Status> {
        return this.http.post<Status>(this.addProductURL, data)
    }
    GetDocumentBody(data: TokenModel): Observable<DocumentBodyModel[]> {
        return this.http.post<DocumentBodyModel[]>(this.getDocumentBodyURL, data)
    }
    DeleteDocumentItem(data: TokenModel): Observable<Status> {
        return this.http.post<Status>(this.deleteDocumentItemURL, data)
    }
    EditProduct(data: EditProductModel): Observable<Status> {
        return this.http.post<Status>(this.editProductURL, data)
    }
    PushDocument(data: TokenModel): Observable<Status> {
        return this.http.post<Status>(this.pushDocumentURL, data)
    }
    GetMyDocs(data: TokenModel): Observable<DocumentsListModel[]> {
        return this.http.post<DocumentsListModel[]>(this.getMyDocsURL, data)
    }
    GenerateFiles(data: TokenModel): Observable<Status> {
        return this.http.post<Status>(this.generateFilesURL, data)
    }
    GetDocBase(data: TokenModel): Observable<BaseModel[]> {
        return this.http.post<BaseModel[]>(this.getDocBaseurl, data)
    }
    AddGSMCodes(data: AddGSMModel): Observable<Status> {
        return this.http.post<Status>(this.addGSMCodesURL, data)
    }
    DeleteGSMCode(data: TokenModel): Observable<Status> {
        return this.http.post<Status>(this.deleteGSMCodeURL, data)
    }
    GetGSMCodes(data: TokenModel): Observable<GetGSMModel[]> {
        return this.http.post<GetGSMModel[]>(this.getGSMCodesURL, data)
    }
    ClearGSM(data: TokenModel): Observable<Status> {
        return this.http.post<Status>(this.clearGSMURL, data)
    }
}