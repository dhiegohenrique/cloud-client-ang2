import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonFormComponent } from './person-form/person-form.component';
import { AuthGuard } from './guards/auth-guard';
import { LoginComponent } from './login/login.component';
import { FormDeactivateGuard } from './guards/form-deactivate-guard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'person', component: PersonFormComponent, canDeactivate: [FormDeactivateGuard]},
  {
    path: 'home',
    loadChildren: 'app/home/home.module#HomeModule',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
