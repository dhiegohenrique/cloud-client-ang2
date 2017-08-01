import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Cloud } from './models/cloud';
import { CloudsService } from './clouds.service';

@Injectable()
export class CloudsResolver implements Resolve<Cloud[]> {

  constructor(private cloudsService: CloudsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Cloud[] | Observable<Cloud[]> | Promise<Cloud[]> {
    return this.cloudsService.getClouds();
  }
}
