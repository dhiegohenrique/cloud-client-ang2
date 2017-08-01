import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SliderComponent } from './slider.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        SliderComponent
    ],
    declarations: [
        SliderComponent
    ]
})
export class SliderModule { }
