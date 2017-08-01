import { Component, OnInit, Input } from '@angular/core';
import { Messages } from '../../messages/messages';

@Component({
  selector: 'app-status-message',
  templateUrl: './status-message.component.html',
  styleUrls: ['./status-message.component.css']
})
export class StatusMessageComponent implements OnInit {

  @Input() message: string;
  @Input() success: boolean;

  constructor() { }

  ngOnInit() {
  }

  aplicaCss() {
    let css = 'alert-danger';
    if (this.success) {
      css = 'alert-success';
    }

    return `alert ${css}`;
  }

  getMessage() {
    if (this.message) {
      return this.message;
    }

    if (this.success === true) {
      return Messages.DEFAULT_SUCCESS;
    }

    if (this.success === false) {
      return Messages.DEFAULT_ERROR;
    }

    return null;
  }
}
