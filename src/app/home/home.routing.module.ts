import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { FormDeactivateGuard } from '../guards/form-deactivate-guard.service';
import { CloudsResolver } from '../clouds/clouds-resolver';
import { CloudsFormComponent } from '../clouds/clouds-form/clouds-form.component';
import { CloudsFormResolver } from '../clouds/clouds-form/clouds-form-resolver';
import { AuthGuard } from '../guards/auth-guard';
import { PersonResolver } from '../person-form/person-resolver';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    resolve: {
      clouds: CloudsResolver,
      person: PersonResolver
    },
    children: [
      {
        path: 'new', component: CloudsFormComponent,
        canDeactivate: [FormDeactivateGuard],
        canActivate: [AuthGuard],
        canLoad: [AuthGuard]
      },
      {
        path: ':id', component: CloudsFormComponent,
        canDeactivate: [FormDeactivateGuard],
        resolve: {cloud: CloudsFormResolver},
        canActivate: [AuthGuard],
        canLoad: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
