import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

export interface IConfirmModal {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
}

@Component({
  selector: 'app-confirmmodal',
  templateUrl: './confirmmodal.component.html',
  styleUrls: ['./confirmmodal.component.css']
})
export class ConfirmModalComponent extends DialogComponent<IConfirmModal, boolean> implements IConfirmModal {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  confirm() {
    this.result = true;
    this.close();
  }
}
