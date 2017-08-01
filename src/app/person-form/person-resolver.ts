import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Person } from './models/person';
import { PersonService } from './person.service';

@Injectable()
export class PersonResolver implements Resolve<Person> {

  constructor(private personService: PersonService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Person | Observable<Person> | Promise<Person> {
    return this.personService.getPerson();
  }
}
