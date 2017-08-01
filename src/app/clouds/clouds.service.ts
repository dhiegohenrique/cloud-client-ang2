import { Injectable, EventEmitter, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Cloud } from './models/cloud';
import { BaseService } from '../shared/services/base.service';
import { environment } from '../../environments/environment';

@Injectable()
export class CloudsService extends BaseService {

  static eventEmitter = new EventEmitter<Cloud>();

  constructor(injector: Injector) {
    super(injector);
  }

  getClouds(): Observable<Cloud[]> {
    return this.get<Cloud[]>(this.getUrl(), true);
  }

  getCloud(id: string): Observable<Cloud> {
    return this.get<Cloud>(this.getUrl(id), true);
  }

  deleteCloud(id: string): Observable<any> {
    return this.delete(this.getUrl(id));
  }

  insertUpdateCloud(cloud: Cloud) {
    return super.insertUpdate(this.getUrl(cloud.id), cloud, true);
  }

  getUrl(id?: string): string {
    let url = environment.urlCloud;
    if (id) {
      url += `/${id}`;
    }
    return url;
  }
}
