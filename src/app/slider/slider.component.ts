import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  isAuthenticate(): boolean {
    return this.loginService.authenticate();
  }
}
