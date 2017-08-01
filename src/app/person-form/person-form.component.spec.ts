import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonFormComponent } from './person-form.component';
import { ReactiveFormsModule } from "@angular/forms";
import { CampoControlErroModule } from "../shared/components/campo-control-erro/campo-control-erro.module";
import { StatusMessageModule } from "../shared/components/status-message/status-message.module";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpModule, ResponseOptions, Response } from "@angular/http";
import { LocalStorageModule } from "angular-2-local-storage/dist";
import { PersonService } from "./person.service";
import { DialogService } from "ng2-bootstrap-modal";
import { LoadingService } from "../shared/services/loading/loading.service";
import { LoginService } from "../login/login.service";
import { By } from "@angular/platform-browser";
import { Person } from "./models/person";
import { Observable } from "rxjs/Observable";
import { inject } from "@angular/core/testing";
import { Router } from "@angular/router";

let persons: Array<Person>;
function fillInPersons() {
  persons = new Array();
  for (let index = 1; index <= 3; index++) {
    let person = new Person();
    person.id = index.toString();
    person.name = `person${index}`;
    person.username = `username${index}`;
    person.password = `password${index}`;
    persons.push(person);
  }
}

class MockLoginService extends LoginService {

  doLoginByPerson(person: Person) {
    const responseOptions = new ResponseOptions();
    const response = new Response(responseOptions);
    return Observable.of(response);
  }

  setAuthenticate(res: Response) {}
}

class MockPersonService extends PersonService {

  insertUpdatePerson(person: Person) {
    const findPerson = persons.find((currentPerson) => {
      return currentPerson.username === person.username;
    });

    let responseOptions: ResponseOptions;
    let response: Response;

    if (findPerson) {
      responseOptions = new ResponseOptions({body : ['ocorred um erro']});
      response = new Response(responseOptions);
      return Observable.throw(response);
    }

    person.id = (Number(persons[persons.length - 1].id) + 1).toString();
    persons.push(person);
    
    responseOptions = new ResponseOptions();
    response = new Response(responseOptions);
    return Observable.of(response);
  }
}

describe('PersonFormComponent', () => {
  let component: PersonFormComponent;
  let fixture: ComponentFixture<PersonFormComponent>;

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
        PersonFormComponent
      ],
      providers: [
        {
          provide: PersonService,
          useClass: MockPersonService
        },
        LoadingService,
        DialogService,
        {
          provide: LoginService,
          useClass: MockLoginService
        }
      ]
    })
    .compileComponents();

    fillInPersons();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonFormComponent);
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

  it('should be show a message when username exists', () => {
    const person = persons[0];
    
    component.form.get('name').setValue(person.name);
    component.form.get('username').setValue(person.username);
    component.form.get('password').setValue(person.password);
    
    component.onSubmit();
    fixture.autoDetectChanges();

    const statusMessage = fixture.debugElement.query(By.css('app-status-message'));
    expect(statusMessage.componentInstance['success']).toBe(false);
  });

  it('should be navigate to home page when the person successfully registered', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigate');
  
    component.form.get('name').setValue(`person${Date.now()}`);
    component.form.get('username').setValue(`uersname${Date.now()}`);
    component.form.get('password').setValue(`password${Date.now()}`);

    component.onSubmit();

    expect(persons[persons.length - 1].id).toEqual(String(persons.length));
    
    const url: string = spy.calls.first().args[0];
    expect(url).toContain('home');
  }));
});
