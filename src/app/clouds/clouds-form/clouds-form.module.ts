import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CampoControlErroModule } from './../../shared/components/campo-control-erro/campo-control-erro.module';
import { CloudsFormComponent } from './clouds-form.component';
import { StatusMessageModule } from '../../shared/components/status-message/status-message.module';
import { OnlyNumberDirective } from '../../shared/directives/only-number.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CampoControlErroModule,
    StatusMessageModule
  ],
  declarations: [
    CloudsFormComponent,
    OnlyNumberDirective
  ],
  exports: [
    CloudsFormComponent
  ]
})
export class CloudsFormModule { }
