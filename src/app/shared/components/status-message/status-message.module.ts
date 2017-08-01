import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusMessageComponent } from './status-message.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StatusMessageComponent
  ],
  exports: [
    StatusMessageComponent
  ]
})
export class StatusMessageModule { }
