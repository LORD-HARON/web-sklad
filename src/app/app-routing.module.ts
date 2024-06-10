import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component/login.component';
import { MenuComponent } from './components/tsd-components/menu.component/menu.component';
import { WorkSpaceComponent } from './components/tsd-components/work-space.component/work-space.component';
import { loginGuard } from './app..guard';
import { DocumentItemsComponent } from './components/tsd-components/document-items.component/document-items.component';
import { DocumentsComponent } from './components/tsd-components/documents.component/documents.component';
import { InfoComponent } from './components/tsd-components/info.component/info.component';
import { TsdComponent } from './components/tsd-components/tsd.component/tsd.component';

const tsdRoutes: Routes = [
  { path: 'menu', component: MenuComponent },
  { path: 'work-space/:docId', component: WorkSpaceComponent, canActivate: [loginGuard] },
  { path: 'document-items/:docId', component: DocumentItemsComponent, canActivate: [loginGuard] },
  { path: 'documents', component: DocumentsComponent, canActivate: [loginGuard] },
  { path: 'info', component: InfoComponent, canActivate: [loginGuard] },
]

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tsd', component: TsdComponent, children: tsdRoutes, canActivate: [loginGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
