import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmModalComponent } from '../shared/components/confirmmodal/confirmmodal.component';
import { Cloud } from './models/cloud';
import { CloudsService } from './clouds.service';

@Component({
  selector: 'app-clouds',
  templateUrl: './clouds.component.html',
  styleUrls: ['./clouds.component.css']
})
export class CloudsComponent implements OnInit, OnDestroy {

  subscription: Subscription[];

  clouds: Cloud[];

  constructor(
    private cloudsService: CloudsService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.subscription = new Array();

    let subscription = this.route.data.subscribe((data) => {
      if (data.clouds) {
        this.clouds = data.clouds;
      } else {
        this.clouds = new Array();
      }
    });

    this.subscription.push(subscription);

    subscription = CloudsService.eventEmitter.subscribe((cloudSaved) => {
      const cloud = this.clouds.find((currentCloud) => {
        return currentCloud.id === cloudSaved.id;
      });

      if (cloud) {
        cloud.name = cloudSaved.name;
      } else {
        this.clouds.push(cloudSaved);
      }
    });

    this.subscription.push(subscription);
  }

  delete(id: string, $event) {
    $event.preventDefault();
    $event.stopPropagation();

    const subscription = this.dialogService.addDialog(ConfirmModalComponent, {
      title: 'Confirmação',
      'message': `Deseja excluir a instância '${this.getName(id)}'?`
    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.deleteInstance(id);
      }
    });

    this.subscription.push(subscription);
  }

  getName(id: string) {
    const cloud = this.clouds.find((currentCloud) => {
      return currentCloud.id === id;
    });

    return cloud.name;
  }

  deleteInstance(id: string) {
    const subscription = this.cloudsService.deleteCloud(id)
      .subscribe(() => {
        this.clouds = this.clouds.filter((cloud) => {
          return cloud.id !== id;
        });
      });

    this.subscription.push(subscription);
    this.redirectToPrevious(id);
  }

  redirectToPrevious(id: string) {
    const urls: string[] = this.router.url.split('/');
    const index: number = urls.indexOf(id);
    if (index > 0) {
      this.router.navigate([`${urls[index - 1]}`]);
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscription) {
      subscription.unsubscribe();
    }

    this.subscription = new Array();
  }
}
