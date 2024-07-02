import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component/login.component';
import { MenuComponent } from './components/tsd-components/menu.component/menu.component';
import { WorkSpaceComponent } from './components/tsd-components/work-space.component/work-space.component';
import { loginGuard } from './app.guard';
import { DocumentItemsComponent } from './components/tsd-components/document-items.component/document-items.component';
import { DocumentsComponent } from './components/tsd-components/documents.component/documents.component';
import { InfoComponent } from './components/tsd-components/info.component/info.component';
import { TsdComponent } from './components/tsd-components/tsd.component/tsd.component';
import { ServiceComponent } from './components/sklad-components/service-component/service.component';
import { ProductComponent } from './components/sklad-components/product-component/product.component';
import { TaskComponent } from './components/sklad-components/task-managment/task-component/task.component';
import { PersonalMenegmentComponent } from './components/sklad-components/porsonal-menegment-component/personal-menegment.component';
import { HistoryComponent } from './components/sklad-components/history-component/history.component';
import { MotivationComponent } from './components/sklad-components/motivation-component/motivation.component';
import { ErrorJournalComponent } from './components/sklad-components/error-journal-component/error-journal.component';
import { ListDocumentComponent } from './components/sklad-components/list-document-component/list-document.component';
import { UnloadingDocumentsComponent } from './components/sklad-components/unloading-documents-component/unloading-documents.component';
import { MapComponent } from './components/sklad-components/map-menegment/map-component/map.component';
import { MapEditorComponent } from './components/sklad-components/map-menegment/map-editor.component/map-editor.component';

const tsdRoutes: Routes = [
  { path: 'menu', component: MenuComponent },
  { path: 'work-space/:docId', component: WorkSpaceComponent, canActivate: [loginGuard] },
  { path: 'document-items/:docId', component: DocumentItemsComponent, canActivate: [loginGuard] },
  { path: 'documents', component: DocumentsComponent, canActivate: [loginGuard] },
  { path: 'info', component: InfoComponent, canActivate: [loginGuard] },
]

const serviceRoutes: Routes = [
  { path: 'product', component: ProductComponent },
  { path: 'task', component: TaskComponent },
  { path: 'personal', component: PersonalMenegmentComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'motivation', component: MotivationComponent },
  { path: 'error-journal', component: ErrorJournalComponent },
  { path: 'list-doc', component: ListDocumentComponent },
  { path: 'unloading-doc', component: UnloadingDocumentsComponent },
  { path: 'map', component: MapComponent },
  { path: 'map-editor', component: MapEditorComponent }
]

const routes: Routes = [
  { path: '', redirectTo: '/service/product', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'tsd', component: TsdComponent, children: tsdRoutes, canActivateChild: [loginGuard] },
  { path: 'service', component: ServiceComponent, children: serviceRoutes, canActivateChild: [loginGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
