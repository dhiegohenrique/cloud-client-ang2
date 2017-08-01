import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { FormUtils } from '../shared/utils/form-utils';
import { ConfirmModalComponent } from '../shared/components/confirmmodal/confirmmodal.component';
import { Person } from './models/person';
import { PersonService } from './person.service';
import { LoginService } from '../login/login.service';
import { IFormDeactive } from '../guards/iform-deactivate';
import { BaseForm } from '../shared/components/form/base-form';
import { Messages } from '../shared/messages/messages';
import { DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent extends BaseForm implements OnInit, IFormDeactive, OnDestroy {

  form: FormGroup;
  isSubmitted: boolean;
  formUtils: FormUtils;
  person: Person;
  personMaster: Person;
  message: string;
  subscription: Subscription;
  success: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private personService: PersonService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    dialogService: DialogService
  ) {
    super(dialogService);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    this.subscription = this.route.data.subscribe((data) => {
      if (data.person) {
        this.person = data.person;
        this.personMaster = Object.assign({}, data.person);
      } else {
        this.person = new Person();
      }
    });

    this.formUtils = new FormUtils(this.form);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    this.personService.insertUpdatePerson(this.person)
      .subscribe((res) => {
        if (!this.personMaster) {
          this.doLogin();
          return;
        }

        this.message = null;
        this.success = true;
      }, (error: Response) => {
        this.message = error.json()[0];
        this.success = false;
      });
  }

  doLogin() {
    this.loginService.doLoginByPerson(this.person)
      .subscribe((res: Response) => {
        this.loginService.setAuthenticate(res);
        this.router.navigate(['home']);
      }, (error: Response) => {
        this.message = error.json()['message'];
        if (!this.message) {
          this.message = Messages.DEFAULT_ERROR;
        }

        this.loginService.removeAuthenticate();
      });
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

  showConfirmLogoff() {
    this.dialogService.addDialog(ConfirmModalComponent, {
      title: 'Confirmação',
      'message': 'Deseja deslogar?'
    }).subscribe((isConfirmed) => {
      if (!isConfirmed) {
        return;
      }

      this.isSubmitted = true;
      this.loginService.removeAuthenticate();
      this.cancel();
    });
  }

  cancel() {
    this.router.navigate(['']);
  }

  canDeactive() {
    if (this.isSubmitted || !this.personMaster) {
      return true;
    }

    return super.canDeactive(this.person, this.personMaster);
  }
}
