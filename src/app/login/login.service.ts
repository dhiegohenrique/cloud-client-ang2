import { Injectable, Injector } from '@angular/core';
import { Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Login } from './models/login';
import { BaseService } from '../shared/services/base.service';
import { Person } from '../person-form/models/person';

@Injectable()
export class LoginService extends BaseService {

  isAuthenticate: boolean;

  constructor(injector: Injector) {
    super(injector);
  }

  doLogin(login: Login) {
    return this.post(environment.urlLogin, login);
  }

  doLoginByPerson(person: Person) {
    const login = new Login();
    login.username = person.username;
    login.password = person.password;
    return this.doLogin(login);
  }

  removeAuthenticate() {
    this.localStorageService.remove('id');
    this.localStorageService.remove('token');
    this.isAuthenticate = false;
  }

  authenticate(): boolean {
    return this.isAuthenticate;
  }

  setAuthenticate(res: Response) {
    const token = this.getTokenFromResponse(res);
    const id = String(res.text());

    this.localStorageService.add('id', id);
    this.localStorageService.add('token', token);
    this.isAuthenticate = true;
  }

  getTokenFromResponse(res: Response): string {
    let token = res.headers.get('authorization');
    token = token.replace('Bearer', '').trim();
    return token;
  }
}
