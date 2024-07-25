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
import { JournalComponent } from './components/sklad-components/journal-component/journal.component';
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
import { SelectCellFormComponent } from './components/sklad-components/task-managment/task-dialog/select-cell-form/select-cell-form.component';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { ClearFormDialogComponent } from './components/sklad-components/task-managment/task-dialog/clear-form-dialog/clear-form-dialog.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { DocListComponent } from './components/sklad-components/task-managment/task-dialog/doc-list/doc-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { DetailDocFormComponent } from './components/sklad-components/task-managment/task-dialog/detail-doc-form/detail-doc-form.component';
import { SelectUserFormComponent } from './components/sklad-components/task-managment/task-dialog/select-user-form/select-user-form.component';
import { PersonalListFormComponent } from './components/sklad-components/porsonal-menegment-component/personal-list-form/personal-list-form.component';
import { ConfirmationNewTaskFormComponent } from './components/sklad-components/task-managment/task-dialog/confirmation-new-task/confirmation-new-task.component';
import { PersonalUsersComponent } from './components/sklad-components/porsonal-menegment-component/personal-users-component/personal-users.component';
import { PersonalBadgeFormConponent } from './components/sklad-components/porsonal-menegment-component/personal-users-component/personal-users.component';
import { ChangeWhoSendDocComponent } from './components/sklad-components/porsonal-menegment-component/change-who-send-doc-component/change-who-send-doc.component';
import { ChangeWhoSendDocDialog } from './components/sklad-components/porsonal-menegment-component/change-who-send-doc-component/change-who-send-doc.component';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MotivationSumPositionDialogComponent } from './components/sklad-components/motivation-component/motivation.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventoryDialogFormComponent } from './components/sklad-components/map-menegment/inventory-dialog-component/inventory-dialog.component';
import { StillageDialogComponent } from './components/sklad-components/stillages/stillage-dialog.component/stillage-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MapEditorDialogActionComponent } from './components/sklad-components/map-menegment/map-editor.component/map-editor.component';
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
    JournalComponent,
    HistoryComponent,
    MotivationComponent,
    UnloadingDocumentsComponent,
    MapComponent,
    MapEditorComponent,
    BaseFormComponent,
    ProcPersonalListFormComponent,
    ProcessesFormComponent,
    SelectCellFormComponent,
    ClearFormDialogComponent,
    DocListComponent,
    DetailDocFormComponent,
    SelectUserFormComponent,
    PersonalListFormComponent,
    ConfirmationNewTaskFormComponent,
    PersonalUsersComponent,
    PersonalBadgeFormConponent,
    ChangeWhoSendDocComponent,
    ChangeWhoSendDocDialog,
    MotivationSumPositionDialogComponent,
    InventoryDialogFormComponent,
    StillageDialogComponent,
    MapEditorDialogActionComponent
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
    PinchZoomModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    MatGridListModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTabsModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  providers: [
    provideAnimationsAsync(),
    DatePipe,
    MatNativeDateModule,
    { provide: MAT_DATE_LOCALE, useValue: 'ru-Ru' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
