import { TestBed, inject } from '@angular/core/testing';

import { PersonService } from './person.service';
import { Http, Headers, Response, BaseRequestOptions, ResponseOptions, RequestMethod } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { LoadingService } from "../shared/services/loading/loading.service";
import { DialogService } from "ng2-bootstrap-modal";
import { LocalStorageModule, LocalStorageService } from "angular-2-local-storage/dist";
import { Person } from "./models/person";
import { MockConnection } from "@angular/http/testing";
import * as HttpStatus from 'http-status-codes';

describe('PersonService', () => {
  let persons: Array<Person>;
  let localStorageService: LocalStorageService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LocalStorageModule.withConfig({
            prefix: 'cloud-cli-ang',
            storageType: 'localStorage'
        })
      ],
      providers: [
        PersonService,
        {
          provide: Http, useFactory: (backend, options) => {
            return new Http(backend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions,
        LoadingService,
        DialogService
      ]
    });

    localStorageService = TestBed.get(LocalStorageService);

    const loadingService: LoadingService = TestBed.get(LoadingService);
    spyOn(loadingService, 'openModal').and.returnValue({});
    fillInPersons();
  });

  function fillInPersons() {
    persons = new Array();

    for (let index = 1; index <= 3; index++) {
      const person = new Person();
      person.id = index.toString();
      person.name = `person${Date.now()}`;
      person.username = `uersname${Date.now()}`;
      person.password = `password${Date.now()}`;
      persons.push(person);
    }
  }

  it('should be created', inject([PersonService], (service: PersonService) => {
    expect(service).toBeTruthy();
  }));

  it('should be insert the person', inject([PersonService, MockBackend], (service: PersonService, mockBackend: MockBackend) => {
    const person = new Person();
    person.name = 'newPerson';
    person.username = 'newUsername';
    person.password = 'newPassword';

    const lastId = Number(persons[persons.length - 1].id);
    const nextId = (lastId + 1);
    setupConnections(mockBackend, person);

    service
      .insertUpdatePerson(person)
      .subscribe((response: Response) => {
        expect(response.status).toEqual(HttpStatus.CREATED);
        expect(getPersonById(nextId.toString()).id).toEqual(nextId.toString());
      })
  }));

  it('should be update the person', inject([PersonService, MockBackend], (service: PersonService, mockBackend: MockBackend) => {
    const oldPerson = Object.assign({}, persons[0]);
    oldPerson.name = `${oldPerson.name} - editado`;

    setupConnections(mockBackend, oldPerson);

    service
      .insertUpdatePerson(oldPerson)
      .subscribe((response: Response) => {
        expect(response.status).toEqual(HttpStatus.NO_CONTENT);
        expect(JSON.stringify(getPersonById(oldPerson.id))).toEqual(JSON.stringify(oldPerson));
      })
  }));

  it('should be returns the person by id', inject([PersonService, MockBackend], (service: PersonService, mockBackend: MockBackend) => {
    const id = persons[0].id;
    localStorageService.add('id', id);
    
    setupConnections(mockBackend);

    service
      .getPerson()
      .subscribe((response: Person) => {
        expect(JSON.stringify(response)).toEqual(JSON.stringify(getPersonById(id)));
      })
  }));

  function setupConnections(backend: MockBackend, person?: Person) {
    backend.connections.subscribe((connection: MockConnection) => {
      let responseOptions: ResponseOptions;
      let response: Response;
      const url: string = connection.request.url;

      switch(connection.request.method) {
        case RequestMethod.Post:
          insertUpdate(person);
          responseOptions = new ResponseOptions({status: HttpStatus.CREATED});
          response = new Response(responseOptions);
        break;

        case RequestMethod.Put:
          insertUpdate(person);
          responseOptions = new ResponseOptions({status: HttpStatus.NO_CONTENT});
          response = new Response(responseOptions);
        break;

        default:
          const id = localStorageService.get<string>('id');
          const body = JSON.stringify(getPersonById(id));
          responseOptions = new ResponseOptions({"body" : body});
          response = new Response(responseOptions);
        break;
      }

      connection.mockRespond(response);
    });
  }

  function insertUpdate(person: Person) {
    if (!person.id) {
      const lastPerson = persons[persons.length - 1];
      person.id = (Number(lastPerson.id) + 1).toString();
      persons.push(person);
      return;
    }

    let index = persons.findIndex((p) => {
      return p.id === person.id;
    });

    Object.assign(persons[index], person);
  }

  function getPersonById(id: string) {
    const person = persons.find((cloud) => {
      return cloud.id === id;
    });

    return person;
  }
});
