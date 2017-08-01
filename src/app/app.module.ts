import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpModule } from '@angular/http';
import { LocalStorageModule } from 'angular-2-local-storage';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { LoadingModule } from './shared/components/loading/loading.module';
import { ConfirmModalModule } from './shared/components/confirmmodal/confirmmodal.module';
import { SliderModule } from './slider/slider.module';
import { AuthGuard } from './guards/auth-guard';
import { FormDeactivateGuard } from './guards/form-deactivate-guard.service';
import { LoginModule } from './login/login.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    HomeModule,
    LoadingModule,
    ConfirmModalModule,
    SliderModule,
    LoginModule,
    LocalStorageModule.withConfig({
        prefix: 'cloud-cli-ang',
        storageType: 'localStorage'
    })
  ],
  providers: [
    AuthGuard,
    FormDeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
