import { TestBed, inject } from '@angular/core/testing';

import { LoginService } from './login.service';
import { Http, Response, BaseRequestOptions, ResponseOptions, RequestMethod, Headers } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { LoadingService } from "../shared/services/loading/loading.service";
import { DialogService } from "ng2-bootstrap-modal";
import { LocalStorageModule, LocalStorageService } from "angular-2-local-storage/dist";
import { Login } from "./models/login";
import { MockConnection } from "@angular/http/testing";
import { Person } from "../person-form/models/person";

describe('LoginService', () => {
  let logins = new Array();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LocalStorageModule.withConfig({
            prefix: 'cloud-cli-ang',
            storageType: 'localStorage'
        })
      ],
      providers: [
        LoginService,
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

    const loadingService: LoadingService = TestBed.get(LoadingService);
    spyOn(loadingService, 'openModal').and.returnValue({});
    fillInLogins();
  });

  function fillInLogins() {
    logins = new Array();

    for (let index = 1; index <=3; index++) {
      const login = new Login();
      login.username = `username${index}`;
      login.password = `password${index}`;
      logins.push(login);
    }
  }

  it('should be created', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));

  it('should be do login by login', inject([LoginService, MockBackend], (service: LoginService, mockBackend: MockBackend) => {
    const login = logins[0];
    setupConnections(mockBackend, login);

    service
      .doLogin(login)
      .subscribe((response: Response) => {
        expect(response.headers).toBeTruthy();

        const authorization: string = response.headers.get('authorization');
        expect(authorization).toContain('Bearer');
      });
  }));

  it('should be remove the authenticate', inject([LoginService, LocalStorageService], (service: LoginService, localStorageService: LocalStorageService) => {
    localStorageService.add('id', '123asdfasdf12');
    localStorageService.add('token', 'meuToken');
    service.isAuthenticate = true;

    service.removeAuthenticate();

    expect(localStorageService.get<string>('id')).toBeFalsy();
    expect(localStorageService.get<string>('token')).toBeFalsy();
    expect(service.authenticate()).toBe(false);
  }));

  it('should be set the authenticate', inject([LoginService, LocalStorageService], (service: LoginService, localStorageService: LocalStorageService) => {
    const headers = new Headers();
    headers.append('authorization', 'Bearer meuToken');

    const responseOptions = new ResponseOptions({"headers": headers});
    const response = new Response(responseOptions);

    service.setAuthenticate(response);
    
    expect(localStorageService.get<string>('token')).toBeTruthy();
    expect(service.authenticate()).toBe(true);
  }));

  function setupConnections(backend: MockBackend, login?: Login) {
    backend.connections.subscribe((connection: MockConnection) => {
      const url: string = connection.request.url;

      const headers = new Headers();
      if (getLogin(login)) {
        headers.append('authorization', `Bearer meuToken`);
      }

      const responseOptions = new ResponseOptions({"headers": headers});
      const response = new Response(responseOptions);
      connection.mockRespond(response);
    });

    function getLogin(login: Login): Login {
      return logins.find((currentLogin) => {
        return currentLogin.username === login.username && currentLogin.password === login.password;
      });
    }
  }
});
