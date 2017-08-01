import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { PersonFormModule } from '../person-form/person-form.module';
import { HomeRoutingModule } from './home.routing.module';
import { CloudsModule } from '../clouds/clouds.module';

@NgModule({
    imports: [
        CommonModule,
        PersonFormModule,
        CloudsModule,
        HomeRoutingModule
    ],
    exports: [
        HomeComponent
    ],
    declarations: [
        HomeComponent
    ]
})
export class HomeModule { }
