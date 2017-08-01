import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Person } from './models/person';
import { LoadingService } from '../shared/services/loading/loading.service';
import { environment } from '../../environments/environment';
import { BaseService } from '../shared/services/base.service';

@Injectable()
export class PersonService extends BaseService {

  constructor(injector: Injector) {
    super(injector);
  }

  insertUpdatePerson(person: Person) {
    return super.insertUpdate(this.getUrl(person), person, (person.id ? true : false));
  }

  getUrl(person: Person): string {
    let url: string = environment.urlPerson;
    if (person.id) {
      url += `/${person.id}`;
    }

    return url;
  }

  getPerson(): Observable<Person> {
    return this.get<Person>(`${environment.urlPerson}/${this.getPersonId()}`, true);
  }
}
