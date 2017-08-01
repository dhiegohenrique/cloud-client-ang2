import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { CampoControlErroModule } from '../shared/components/campo-control-erro/campo-control-erro.module';
import { LoginService } from './login.service';
import { StatusMessageModule } from '../shared/components/status-message/status-message.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CampoControlErroModule,
        StatusMessageModule
    ],
    exports: [
        LoginComponent
    ],
    declarations: [
        LoginComponent
    ],
    providers: [
        LoginService
    ]
})
export class LoginModule { }
