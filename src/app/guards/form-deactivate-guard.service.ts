import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { IFormDeactive } from './iform-deactivate';

@Injectable()
export class FormDeactivateGuard implements CanDeactivate<IFormDeactive> {

  constructor() { }

  canDeactivate(
    component: IFormDeactive,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return component.canDeactive();
  }
}
