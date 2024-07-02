import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './components/login.component/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WorkSpaceComponent } from './components/tsd-components/work-space.component/work-space.component';
import { MenuComponent } from './components/tsd-components/menu.component/menu.component';
import { DocumentItemsComponent } from './components/tsd-components/document-items.component/document-items.component';
import { DocumentsComponent } from './components/tsd-components/documents.component/documents.component';
import { InfoComponent } from './components/tsd-components/info.component/info.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { TsdComponent } from './components/tsd-components/tsd.component/tsd.component';
import { ExitDialog } from './components/tsd-components/menu.component/menu.component';
import { CreateDocumentDialog } from './components/tsd-components/menu.component/menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UrlImgPipe } from './pipes/url-img.pipe';
import { ServiceComponent } from './components/sklad-components/service-component/service.component';
import { NavigationComponent } from './components/sklad-components/navigation-component/navigation.component';
import { ProductComponent } from './components/sklad-components/product-component/product.component';
import { TaskComponent } from './components/sklad-components/task-managment/task-component/task.component';
import { PersonalMenegmentComponent } from './components/sklad-components/porsonal-menegment-component/personal-menegment.component';
import { ListDocumentComponent } from './components/sklad-components/list-document-component/list-document.component';
import { ErrorJournalComponent } from './components/sklad-components/error-journal-component/error-journal.component';
import { HistoryComponent } from './components/sklad-components/history-component/history.component';
import { MotivationComponent } from './components/sklad-components/motivation-component/motivation.component';
import { UnloadingDocumentsComponent } from './components/sklad-components/unloading-documents-component/unloading-documents.component';
import { MapComponent } from './components/sklad-components/map-menegment/map-component/map.component';
import { MapEditorComponent } from './components/sklad-components/map-menegment/map-editor.component/map-editor.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatListModule } from '@angular/material/list';
import { NgxPrintModule } from 'ngx-print';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { BaseFormComponent } from './components/sklad-components/task-managment/base-form.component/base-form.component';
import { ProcPersonalListFormComponent } from './components/sklad-components/task-managment/proc-personal-list-form-component/proc-personal-list-from.component';
import { ProcessesFormComponent } from './components/sklad-components/task-managment/processes-form-component/process-form.component';
import { StillagesModule } from './components/sklad-components/stillages/stillages.module';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WorkSpaceComponent,
    MenuComponent,
    DocumentItemsComponent,
    DocumentsComponent,
    InfoComponent,
    TsdComponent,
    ExitDialog,
    CreateDocumentDialog,
    UrlImgPipe,
    ServiceComponent,
    NavigationComponent,
    ProductComponent,
    TaskComponent,
    PersonalMenegmentComponent,
    ListDocumentComponent,
    ErrorJournalComponent,
    HistoryComponent,
    MotivationComponent,
    UnloadingDocumentsComponent,
    MapComponent,
    MapEditorComponent,
    BaseFormComponent,
    ProcPersonalListFormComponent,
    ProcessesFormComponent,
  ],
  imports: [
    StillagesModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTreeModule,
    MatDialogModule,
    MatExpansionModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSidenavModule,
    CdkTreeModule,
    MatListModule,
    NgxPrintModule,
    MatTableModule,
  ],
  providers: [
    provideAnimationsAsync(),
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
