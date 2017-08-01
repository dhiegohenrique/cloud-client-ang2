import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { LoginService } from './login.service';
import { FormUtils } from '../shared/utils/form-utils';
import { Login } from './models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  isSubmitted: boolean;
  isTokenValid: boolean;
  errorMessage: string;
  formUtils: FormUtils;
  login: Login;
  success: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: [{value: null, disabled: this.isTokenValid}, [Validators.required]],
      password: [null, [Validators.required]]
    });

    this.formUtils = new FormUtils(this.form);
    this.login = new Login();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loginService.doLogin(this.login)
      .subscribe((res: Response) => {
        this.loginService.setAuthenticate(res);
        this.router.navigate(['home']);
      }, (error: Response) => {
        this.errorMessage = error.json()['message'];
        this.success = false;

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

  newPerson() {
    this.router.navigate(['/person']);
  }
}
