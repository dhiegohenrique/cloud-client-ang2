import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { CampoControlErroModule } from "../shared/components/campo-control-erro/campo-control-erro.module";
import { StatusMessageModule } from "../shared/components/status-message/status-message.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { LoginService } from "./login.service";
import { HttpModule, Response, ResponseOptions } from "@angular/http";
import { DialogService } from "ng2-bootstrap-modal";
import { LoadingService } from "../shared/services/loading/loading.service";
import { LocalStorageModule } from "angular-2-local-storage/dist";
import { By } from "@angular/platform-browser";
import { inject } from "@angular/core/testing";
import { Router } from "@angular/router";
import { Login } from "./models/login";
import { Observable } from "rxjs/Observable";

let logins: Array<Login>;

function fillInLogins() {
  logins = new Array();

  for (let index = 1; index <=3; index++) {
    const login = new Login();
    login.username = `username${index}`;
    login.password = `password${index}`;
    logins.push(login);
  }
}

class MockLoginService extends LoginService {

  removeAuthenticate() {}

  setAuthenticate(res: Response) {}

  doLogin(login: Login) {
    const findLogin = logins.find((currentLogin) => {
      return currentLogin.username === login.username && currentLogin.password === login.password;
    });

    let responseOptions: ResponseOptions;
    let response: Response;
    
    if (!findLogin) {
      responseOptions = new ResponseOptions({body : {message: 'ocorred um erro'}});
      response = new Response(responseOptions);
      return Observable.throw(response);
    }

    responseOptions = new ResponseOptions({body : JSON.stringify(findLogin)});
    response = new Response(responseOptions);
    return Observable.of(response);
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        CampoControlErroModule,
        StatusMessageModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpModule,
        LocalStorageModule.withConfig({
            prefix: 'cloud-cli-ang',
            storageType: 'localStorage'
        })
      ],
      providers: [
        LoadingService,
        DialogService,
        {
          provide: LoginService,
          useClass: MockLoginService
        }
      ]
    })
    .compileComponents();

    fillInLogins();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
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

  it('should be show a message when a error ocorred', () => {
    component.form.get('username').setValue('maria');
    component.form.get('password').setValue('123qwe');
  
    component.onSubmit();
    fixture.autoDetectChanges();

    let statusMessage = fixture.debugElement.query(By.css('app-status-message'));
    expect(statusMessage.componentInstance['success']).toBe(false);
  });

  it('should be navigate to person page', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigate');

    const btnCadastrar: HTMLElement = fixture.debugElement.query(By.css('#cadastrar')).nativeElement;
    btnCadastrar.click();

    const url: string = spy.calls.first().args[0];
    expect(url).toContain('/person');
  }));

  it('should be navigate to home page when login is successful', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigate');
    const login = logins[0];

    component.form.get('username').setValue(login.username);
    component.form.get('password').setValue(login.password);
  
    component.onSubmit();

    const url: string = spy.calls.first().args[0];
    expect(url).toContain('home');
  }));
});
