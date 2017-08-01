import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmModalComponent } from './confirmmodal.component';

@NgModule({
    imports: [
        CommonModule,
        ModalModule.forRoot()
    ],
    exports: [
        ConfirmModalComponent
    ],
    declarations: [
        ConfirmModalComponent
    ],
    entryComponents: [
        ConfirmModalComponent
    ]
})
export class ConfirmModalModule { }
