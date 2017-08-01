import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

export interface ILoadingModal {
  title: string;
}

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent extends DialogComponent<ILoadingModal, boolean> implements ILoadingModal {
  title: string;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }
}
