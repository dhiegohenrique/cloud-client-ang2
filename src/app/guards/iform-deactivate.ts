import { Observable } from 'rxjs/Observable';

export interface IFormDeactive {
    canDeactive(): Observable<boolean>|Promise<boolean>|boolean;
}
