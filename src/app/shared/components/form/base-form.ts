import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmModalComponent } from '../confirmmodal/confirmmodal.component';
import { Messages } from '../../messages/messages';

export class BaseForm {

    constructor(protected dialogService: DialogService) {
    }

    showConfirmMessage(message?: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
          this.dialogService.addDialog(ConfirmModalComponent, {
            title: 'Confirmação',
            'message': message || Messages.DEFAULT_CONFIRM_MESSAGE
            }).subscribe((isConfirmed) => {
                resolve(isConfirmed);
            });
        });
    }

    canDeactive(obj1: any, obj2: any) {
        if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
            return Observable.of(true);
        }

        return Observable.create((observer: Observer<boolean>) => {
            this.showConfirmMessage()
                .then((result) => {
                    observer.next(result);
                    observer.complete();
                });
        });
    }
}
