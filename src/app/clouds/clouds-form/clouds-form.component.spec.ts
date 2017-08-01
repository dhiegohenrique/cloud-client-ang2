/* tslint:disable */

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { HttpModule, Http, BaseRequestOptions, XHRBackend, Response, ResponseOptions, Headers } from "@angular/http";
import { LocalStorageService, LocalStorageModule } from "angular-2-local-storage/dist";
import { DialogService } from "ng2-bootstrap-modal";
import { CloudsFormComponent } from './clouds-form.component';
import { CampoControlErroModule } from "../../shared/components/campo-control-erro/campo-control-erro.module";
import { StatusMessageModule } from "../../shared/components/status-message/status-message.module";
import { OnlyNumberDirective } from "../../shared/directives/only-number.directive";
import { CloudsService } from "../clouds.service";
import { LoadingService } from "../../shared/services/loading/loading.service";
import { DebugElement } from "@angular/core";
import { Cloud } from "../models/cloud";
import { Observable } from "rxjs/Observable";
import {MockBackend, MockConnection} from '@angular/http/testing';
import { inject } from "@angular/core/testing";
import { Observer } from "rxjs/Observer";
import { Router, NavigationExtras } from "@angular/router";
import {Location} from "@angular/common";

class CloudsMockService extends CloudsService {
  
  insertUpdateCloud(cloud: Cloud) {
    const headers = new Headers();
    headers.append('location', `/${Date.now()}`);

    return Observable.of(new Response(
      new ResponseOptions({
        // body: JSON.stringify({color: 'blue'}),
        headers: headers
      })));
  }
}

describe('CloudsFormComponent', () => {
  let component: CloudsFormComponent;
  let fixture: ComponentFixture<CloudsFormComponent>;

  // let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CampoControlErroModule,
        StatusMessageModule,
        RouterTestingModule,
        HttpModule,
        LocalStorageModule.withConfig({
            prefix: 'cloud-cli-ang',
            storageType: 'localStorage'
        })
      ],
      declarations: [
        CloudsFormComponent,
        OnlyNumberDirective
      ],
      providers: [
        {
          provide: CloudsService, 
          useClass: CloudsMockService
        },
        LoadingService,
        DialogService
      ]
    })
    .compileComponents();

    router = TestBed.get(Router); 
    // location = TestBed.get(Location); 
    router.initialNavigation();

    spyOn(router, 'navigate').and.returnValue({});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be show a message when a required field is blank', () => {
    let el = fixture.nativeElement;
    let campoControlErro = fixture.debugElement.query(By.css('app-campo-control-erro'));
    expect(campoControlErro.componentInstance['mostrarErro']).toBeFalsy();
    
    component.onSubmit();
    fixture.autoDetectChanges();

    campoControlErro = fixture.debugElement.query(By.css('app-campo-control-erro'));
    expect(campoControlErro.componentInstance['mostrarErro']).toBeTruthy();
  });

  it('should be show a message when a cloud is updated', () => {
    let el = fixture.nativeElement;
    let statusMessage = fixture.debugElement.query(By.css('app-status-message'));
    // console.log('a1: ' + JSON.stringify(statusMessage.attributes));

    expect(statusMessage.componentInstance['success']).toBeFalsy();
    // console.log('b1: ' + JSON.stringify(statusMessage.componentInstance));
    // console.log('c1: ' + JSON.stringify(statusMessage.classes));
    // console.log('d1: ' + JSON.stringify(statusMessage.properties));
    // console.log('e1: ' + JSON.stringify(statusMessage.styles));

    // expect(statusMessage.context).toBeFalsy();
    // console.log('f1: ' + statusMessage.context);
    // console.log('g1: ' + statusMessage.parent);
    // console.log('h1: ' + statusMessage.nativeElement);
    
    component.cloudMaster = new Cloud();
    component.form.get('name').setValue('cloud' + Date.now());
    component.form.get('operationalSystem').setValue('windows');
    component.form.get('capacity').setValue('10');

    component.onSubmit();
    fixture.autoDetectChanges();

    statusMessage = fixture.debugElement.query(By.css('app-status-message'));
    // console.log('a2: ' + JSON.stringify(statusMessage.attributes));

    expect(statusMessage.componentInstance['success']).toBeTruthy();
    // console.log('b2: ' + JSON.stringify(statusMessage.componentInstance));
    // console.log('c2: ' + JSON.stringify(statusMessage.classes));
    // console.log('d2: ' + JSON.stringify(statusMessage.properties));
    // console.log('e2: ' + JSON.stringify(statusMessage.styles));
    // expect(statusMessage.context).toBeTruthy();
    // console.log('f2: ' + JSON.stringify(statusMessage.context));
    // console.log('g2: ' + statusMessage.parent);
    // console.log('h2: ' + statusMessage.nativeElement);
  });

  it('should be update cloud id when a cloud is saved', () => {
    expect(component.cloud.id).toBeFalsy();

    component.form.get('name').setValue('cloud' + Date.now());
    component.form.get('operationalSystem').setValue('windows');
    component.form.get('capacity').setValue('10');

    component.onSubmit();
    expect(component.cloud.id).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });
});
