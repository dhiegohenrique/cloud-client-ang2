import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonFormComponent } from './person-form.component';
import { CampoControlErroModule } from '../shared/components/campo-control-erro/campo-control-erro.module';
import { SharedModule } from '../shared/shared.module';
import { PersonService } from './person.service';
import { StatusMessageModule } from '../shared/components/status-message/status-message.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CampoControlErroModule,
    SharedModule,
    StatusMessageModule
  ],
  declarations: [
    PersonFormComponent
  ],
  exports: [
    PersonFormComponent
  ],
  providers: [
    PersonService
  ]
})
export class PersonFormModule { }
