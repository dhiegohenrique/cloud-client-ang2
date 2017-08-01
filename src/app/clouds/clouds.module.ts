import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CloudsComponent } from './clouds.component';
import { CloudsService } from './clouds.service';
import { CloudsFormModule } from './clouds-form/clouds-form.module';
import { CloudsResolver } from './clouds-resolver';
import { CloudsFormResolver } from './clouds-form/clouds-form-resolver';
import { PersonResolver } from '../person-form/person-resolver';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CloudsFormModule
  ],
  declarations: [
    CloudsComponent
  ],
  exports: [
    CloudsComponent
  ],
  providers: [
    CloudsService,
    CloudsResolver,
    CloudsFormResolver,
    PersonResolver
  ]
})
export class CloudsModule { }
