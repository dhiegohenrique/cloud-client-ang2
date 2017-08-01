import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Rx';
import { IFormDeactive } from '../../guards/iform-deactivate';
import { Cloud } from '../models/cloud';
import { FormUtils } from '../../shared/utils/form-utils';
import { BaseForm } from '../../shared/components/form/base-form';
import { CloudsService } from '../clouds.service';
import { DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'app-clouds-form',
  templateUrl: './clouds-form.component.html',
  styleUrls: ['./clouds-form.component.css']
})
export class CloudsFormComponent extends BaseForm implements OnInit, IFormDeactive, OnDestroy {

  cloud: Cloud;
  cloudMaster: Cloud;

  subscription: Subscription;

  form: FormGroup;
  formUtils: FormUtils;

  isSubmitted: boolean;
  message: string;
  success: boolean;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private cloudsService: CloudsService,
    dialogService: DialogService
  ) {
    super(dialogService);
  }

  ngOnInit() {
    this.subscription = this.route.data.subscribe((data) => {
      if (data.cloud) {
        let cloud = data.cloud;
        if (Array.isArray(data.cloud)) {
          cloud = data.cloud[0];
        }

        this.cloud = Object.assign({}, cloud);
        this.cloneCloud();
      } else {
        this.cloud = new Cloud();
      }
    });

    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      operationalSystem: [null, [Validators.required]],
      capacity: [null, [Validators.required]],
      active: [this.cloud.active, [Validators.required]],
      createDate: [{value: null, disabled: true}],
      updateDate: [{value: null, disabled: true}],
    });

    this.formUtils = new FormUtils(this.form);
  }

  cloneCloud() {
    this.cloudMaster = Object.assign({}, this.cloud);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    this.cloudsService.insertUpdateCloud(this.cloud)
      .subscribe((res: Response) => {
        if (!this.cloudMaster) {
          this.insertCloud(res);
          return;
        }

        this.updateCloud();
      }, (error: Response) => {
        this.message = error.json()['message'];
        this.success = false;
      });
  }

  insertCloud(res: Response) {
    let location: string = res.headers.get('location');
    location = location.substr(location.lastIndexOf('/') + 1);
    this.cloud.id = location;

    this.emitEvent();
    this.router.navigate(['home']);
  }

  updateCloud() {
    this.message = null;
    this.success = true;
    this.cloud.updateDate = new Date();
    this.cloneCloud();
    this.emitEvent();
  }

  emitEvent() {
    CloudsService.eventEmitter.emit(this.cloud);
  }

  aplicaCssErro(campo) {
    if (!this.isSubmitted) {
      return;
    }

    return this.formUtils.getCssErro(campo);
  }

  isCampoInvalid(campo) {
    return !this.formUtils.isCampoValid(campo) && this.isSubmitted;
  }

  cancel() {
    this.router.navigate(['home']);
  }

  canDeactive() {
    if (this.isSubmitted || !this.cloudMaster) {
      return true;
    }

    return super.canDeactive(this.cloud, this.cloudMaster);
  }
}
