import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Cloud } from "./models/cloud";
import { CloudsComponent } from "./clouds.component";
import { ComponentFixture, async, TestBed, inject } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpModule, ResponseOptions, Headers } from "@angular/http";
import { LocalStorageModule } from "angular-2-local-storage/dist";
import { CloudsService } from "./clouds.service";
import { LoadingService } from "../shared/services/loading/loading.service";
import { DialogService } from "ng2-bootstrap-modal";
import { By } from "@angular/platform-browser";
import { Directive, Input } from "@angular/core";

class MockActivatedRoute extends ActivatedRoute {
  
  constructor() {
    super();

    this.data = Observable.of({clouds: getClouds()});
    this.snapshot = new ActivatedRouteSnapshot();
  }
}

class CloudsMockService extends CloudsService {
  
  deleteCloud(id: string) {
    return Observable.of({});
  }
}

function getClouds() {
  let clouds = new Array<Cloud>();

  for (let index = 1; index <= 3; index++) {
    const cloud = new Cloud();
    cloud.name = 'cloud' + index;
    cloud.id = String(index);
    clouds.push(cloud);
  }

  return clouds;
}

@Directive({
  selector: '[routerLink]',
  host: {
    '(click)': 'onClick()'
  }
})
export class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('CloudsComponent', () => {
  let component: CloudsComponent;
  let fixture: ComponentFixture<CloudsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CloudsComponent,
        RouterLinkStubDirective
      ],
      imports: [
        RouterTestingModule,
        HttpModule,
        LocalStorageModule.withConfig({
            prefix: 'cloud-cli-ang',
            storageType: 'localStorage'
        })
      ],
      providers: [
        {
          provide: CloudsService,
          useClass: CloudsMockService
        },
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        LoadingService,
        DialogService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be create one <a> for each cloud', () => {
    let aCloud = fixture.debugElement.queryAll(By.css('a'));
    expect(aCloud.length).toEqual(getClouds().length);
  });

  it('should be show a message when clouds is empty', () => {
    component.clouds = new Array<Cloud>();
    fixture.autoDetectChanges();

    let message = fixture.debugElement.queryAll(By.css('.alert'));
    expect(message.length).toEqual(1);

    let aCloud = fixture.debugElement.queryAll(By.css('a'));
  });

  it('should be create a <a> when a cloud is inserted', () => {
    let aCloud = fixture.debugElement.queryAll(By.css('a'));
    const oldCloudsLength = aCloud.length;

    const cloud = new Cloud();
    cloud.id = String(Date.now());
    cloud.name = 'novaCloud';

    CloudsService.eventEmitter.emit(cloud);
    fixture.autoDetectChanges();

    aCloud = fixture.debugElement.queryAll(By.css('a'));
    const newCloudsLength = aCloud.length;    

    expect(newCloudsLength).toEqual((oldCloudsLength + 1));
  });

  it('should be update the cloud link when it refreshes', () => {
    let link: HTMLElement = fixture.debugElement.query(By.css('a')).nativeElement;
    const oldName = link.innerText.trim();
    
    const cloud = new Cloud();
    cloud.id = oldName.replace('cloud', '');
    cloud.name = `${oldName} - editado`;

    CloudsService.eventEmitter.emit(cloud);
    fixture.autoDetectChanges();

    link = fixture.debugElement.query(By.css('a')).nativeElement;
    const newName = link.innerText.trim();

    expect(newName).toEqual(cloud.name);
  });

  it('should be delete the cloud link when it deleted', () => {
    let link: HTMLElement = fixture.debugElement.query(By.css('a')).nativeElement;
    const name = link.innerText.trim();
    const id = name.replace('cloud', '');

    component.deleteInstance(id);
    fixture.autoDetectChanges();

    let element: HTMLElement = getLinkById(id);
    expect(element).toBeFalsy();
  });

  function getLinkById(id: string): HTMLElement {
    let links = fixture.debugElement.queryAll(By.css('a'));
    const link = links.find((link) => {
      const element: HTMLElement = link.nativeElement;

      let name: string = element.innerText.trim();
      return (name.indexOf(id) > -1);
    });

    if (!link) {
      return null;
    }

    return link.nativeElement;
  }
});