import { TestBed, inject } from '@angular/core/testing';

import { CloudsService } from './clouds.service';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod, Headers } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { LoadingService } from "../shared/services/loading/loading.service";
import { DialogService } from "ng2-bootstrap-modal";
import { LocalStorageModule } from "angular-2-local-storage/dist";
import { Cloud } from "./models/cloud";
import { MockConnection } from "@angular/http/testing";
import * as HttpStatus from 'http-status-codes';

describe('CloudsService', () => {
  let clouds: Array<Cloud>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LocalStorageModule.withConfig({
            prefix: 'cloud-cli-ang',
            storageType: 'localStorage'
        })
      ],
      providers: [
        CloudsService,
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
    fillInClouds();
  });

  function fillInClouds() {
    clouds = new Array();

    for (let index: number = 1; index <= 5; index++) {
      const cloud = new Cloud();
      cloud.id = index.toString();
      cloud.capacity = (10 + index);
      cloud.createDate = new Date();
      cloud.name = `cloud${index}`;
      cloud.operationalSystem = 'windows';
      clouds.push(cloud);
    }
  }

  it('should be created', inject([CloudsService], (service: CloudsService) => {
    expect(service).toBeTruthy();
  }));

  it('should be returns the clouds', inject([CloudsService, MockBackend], (service: CloudsService, mockBackend: MockBackend) => {
    setupConnections(mockBackend);

    service
      .getClouds()
      .subscribe((response: Cloud[]) => {
        expect(JSON.stringify(response)).toEqual(JSON.stringify(clouds));
      })
  }));

  it('should be returns the cloud by id', inject([CloudsService, MockBackend], (service: CloudsService, mockBackend: MockBackend) => {
    let cloud = clouds[0];
    setupConnections(mockBackend);

    service
      .getCloud(cloud.id)
      .subscribe((response: Cloud) => {
        expect(JSON.stringify(response)).toEqual(JSON.stringify(getCloudById(cloud.id)));
      })
  }));

  it('should be delete the cloud by id', inject([CloudsService, MockBackend], (service: CloudsService, mockBackend: MockBackend) => {
    let cloud = clouds[0];
    setupConnections(mockBackend);

    service
      .deleteCloud(cloud.id)
      .subscribe((response: Response) => {
        expect(response.status).toEqual(HttpStatus.NO_CONTENT);
        expect(getCloudById(cloud.id)).toBeFalsy();
      })
  }));

  it('should be insert the cloud', inject([CloudsService, MockBackend], (service: CloudsService, mockBackend: MockBackend) => {
    const newCloud = new Cloud();
    newCloud.name = 'newCloud';
    newCloud.operationalSystem = 'linux';
    newCloud.capacity = 20;
    
    setupConnections(mockBackend, newCloud);

    service
      .insertUpdateCloud(newCloud)
      .subscribe((response: Response) => {
        expect(response.status).toEqual(HttpStatus.CREATED);
        expect(response.headers).toBeTruthy();

        const location: string = response.headers.get('location');
        expect(location).toContain('/cloud/');
        expect(getCloudById(getCloudId(location))).toBeTruthy();
      })
  }));

  it('should be update the cloud', inject([CloudsService, MockBackend], (service: CloudsService, mockBackend: MockBackend) => {
    const oldCloud = Object.assign({}, clouds[0]);
    oldCloud.name = `${oldCloud.name} - editado`;
    
    setupConnections(mockBackend, oldCloud);

    service
      .insertUpdateCloud(oldCloud)
      .subscribe((response: Response) => {
        expect(response.status).toEqual(HttpStatus.NO_CONTENT);
        expect(JSON.stringify(getCloudById(oldCloud.id))).toEqual(JSON.stringify(oldCloud));
      })
  }));

  function setupConnections(backend: MockBackend, cloud?: Cloud) {
    backend.connections.subscribe((connection: MockConnection) => {
      let responseOptions: ResponseOptions;
      let response: Response;
      const url: string = connection.request.url;

      switch(connection.request.method) {
        case RequestMethod.Delete:
          deleteCloud(getCloudId(url));
          responseOptions = new ResponseOptions({status: HttpStatus.NO_CONTENT});
          response = new Response(responseOptions);
        break;

        case RequestMethod.Post:
          insertUpdate(cloud);
          const headers = new Headers();
          headers.append('location', `/cloud/${cloud.id}`);

          responseOptions = new ResponseOptions({"headers": headers, status: HttpStatus.CREATED});
          response = new Response(responseOptions);
        break;

        case RequestMethod.Put:
          insertUpdate(cloud);
          responseOptions = new ResponseOptions({status: HttpStatus.NO_CONTENT});
          response = new Response(responseOptions);
        break;

        default:
          let body: string;
          if (!url.includes('/cloud/')) {
            body = JSON.stringify(clouds);
          } else {
            body = JSON.stringify(getCloudById(getCloudId(url)));
          }

          responseOptions = new ResponseOptions({"body" : body});
          response = new Response(responseOptions);
        break;
      }

      connection.mockRespond(response);
    });
  }

  function getCloudId(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
  }

  function getCloudById(id: string) {
    const cloud = clouds.find((cloud) => {
      return cloud.id === id;
    });

    return cloud;
  }

  function deleteCloud(id: string) {
    clouds = clouds.filter((cloud) => {
      return cloud.id !== id;
    });
  }

  function insertUpdate(cloud: Cloud) {
    if (!cloud.id) {
      const lastCloud = clouds[clouds.length - 1];
      cloud.id = (Number(lastCloud.id) + 1).toString();
      clouds.push(cloud);
      return;
    }

    let index = clouds.findIndex((c) => {
      return c.id === cloud.id;
    });

    Object.assign(clouds[index], cloud);
  }
});
