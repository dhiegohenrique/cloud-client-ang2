import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { ModalDialogService } from 'ngx-modal-dialog';
import { LoadingService } from './services/loading/loading.service';
import { OnlyNumberDirective } from './directives/only-number.directive';

@NgModule({
    imports: [
        CommonModule,
        BootstrapModalModule
    ],
    providers: [
        LoadingService,
        ModalDialogService
    ]
})
export class SharedModule { }
