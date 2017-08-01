import { Injectable } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subscription } from 'rxjs/Subscription';
import { LoadingComponent } from '../../components/loading/loading.component';

@Injectable()
export class LoadingService {

  private disposable: Subscription;

  constructor(private dialogService: DialogService) {}

  openModal(): void {
    if (this.disposable && !this.disposable.closed) {
      return;
    }

    this.disposable = this.dialogService.addDialog(LoadingComponent, {
      title: 'Carregando...'
    }).subscribe();
  }

  closeModal() {
    if (!this.disposable || this.disposable.closed) {
      return;
    }

    this.disposable.unsubscribe();
  }
}
