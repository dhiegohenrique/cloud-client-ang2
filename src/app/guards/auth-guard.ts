import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Headers, Http, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Observer } from 'rxjs/Observer';
import { LocalStorageService } from 'angular-2-local-storage/dist';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private router: Router,
    private http: Http,
    private localStorageService: LocalStorageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.validate();
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    return this.validate();
  }

  validate(): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      const req = new Request({
          headers: this.getHeaders(),
          method: RequestMethod.Get,
          url: `${environment.urlPerson}/${this.getPersonId()}`
      });

      this.http.request(req)
        .finally(() => observer.complete())
        .subscribe((res) => {
          observer.next(true);
        }, (error: Response) => {
          observer.next(false);
          this.router.navigate(['login']);
        });
    });
  }

  getHeaders(): Headers {
      const headers = new Headers();
      const token = this.getToken();
      if (token) {
        headers.append('Authorization', token);
      }

      return headers;
  }

  getToken(): string {
      return this.localStorageService.get<string>('token');
  }

  getPersonId(): string {
    return this.localStorageService.get<string>('id');
  }
}
