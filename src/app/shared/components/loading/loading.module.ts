import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoadingComponent } from './loading.component';

@NgModule({
    imports: [
        CommonModule,
        ModalModule.forRoot()
    ],
    exports: [
        LoadingComponent
    ],
    declarations: [
        LoadingComponent
    ],
    entryComponents: [
        LoadingComponent
    ]
})
export class LoadingModule { }
