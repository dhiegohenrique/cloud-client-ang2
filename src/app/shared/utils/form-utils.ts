import { FormGroup } from '@angular/forms';

export class FormUtils {

    form: FormGroup;

    constructor(form: FormGroup) {
        this.form = form;
    }

    isCampoValid(campo: string) {
        return this.form.get(campo).valid;
    }

    getCssErro(campo: string) {
        return {
            'has-error': !this.isCampoValid(campo)
        };
    }
}
