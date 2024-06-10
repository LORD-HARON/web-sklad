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
    UrlImgPipe
  ],
  imports: [
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
    MatSidenavModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
