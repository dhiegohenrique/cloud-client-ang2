import { Headers, Http, Request, RequestMethod } from '@angular/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { LocalStorageService } from 'angular-2-local-storage/dist';
import { LoadingService } from './loading/loading.service';

export abstract class BaseService {

    private http: Http;

    private loadingService: LoadingService;

    localStorageService: LocalStorageService;

    constructor(private injector: Injector) {
        this.http = this.injector.get(Http);
        this.loadingService = this.injector.get(LoadingService);
        this.localStorageService = this.injector.get(LocalStorageService);
    }

    getHeaders(): Headers {
        const headers = new Headers();
        const token = this.getToken();
        if (token) {
            headers.append('Authorization', this.getToken());
        }

        return headers;
    }

    getToken(): string {
        return this.localStorageService.get<string>('token');
    }

    request(req: Request): Observable<any> {
        this.loadingService.openModal();
        return this.http.request(req)
            .finally(() => this.loadingService.closeModal());
    }

    post(url: string, body: any, hasHeaders?: boolean): Observable<any> {
        const req = new Request({
            headers: hasHeaders ? this.getHeaders() : null,
            method: RequestMethod.Post,
            'url': url,
            'body': body
        });

        return this.request(req);
    }

    put(url: string, body: any): Observable<any> {
        const req = new Request({
            headers: this.getHeaders(),
            method: RequestMethod.Put,
            'url': url,
            'body': body
        });

        return this.request(req);
    }

    delete(url: string): Observable<any> {
        const req = new Request({
            headers: this.getHeaders(),
            method: RequestMethod.Delete,
            'url': url
        });

        return this.request(req);
    }

    getPersonId(): string {
        return this.localStorageService.get<string>('id');
    }

    getPostOrPutMethod(id): RequestMethod {
        let method: RequestMethod = RequestMethod.Post;
        if (id) {
            method = RequestMethod.Put;
        }

        return method;
    }

    get<T>(url: string, hasHeaders?: boolean): Observable<T> {
        const req = new Request({
            headers: hasHeaders ? this.getHeaders() : null,
            method: RequestMethod.Get,
            'url': url
        });

        return Observable.create((observer: Observer<T>) => {
            this.request(req)
            .map(res => res.json())
            .finally(() => observer.complete())
            .subscribe((res: T) => {
                observer.next(res);
            }, (error: Response) => {
                observer.error(error);
            });
        });
    }

    // insertUpdate(url: string, body: any, id?: string) {
    //     const req = new Request({
    //         headers: id ? this.getHeaders() : null,
    //         method: this.getPostOrPutMethod(id),
    //         'url': url,
    //         'body': body
    //     });

    //     return this.request(req);
    // }

    insertUpdate(url: string, body: any, hasHeaders?: boolean) {
        const req = new Request({
            headers: hasHeaders ? this.getHeaders() : null,
            method: this.getPostOrPutMethod(body['id']),
            'url': url,
            'body': body
        });

        return this.request(req);
    }
}
