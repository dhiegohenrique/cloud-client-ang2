import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampoControlErroComponent } from './campo-control-erro.component';
import { By } from "@angular/platform-browser";

describe('CampoControlErrorComponent', () => {
  let component: CampoControlErroComponent;
  let fixture: ComponentFixture<CampoControlErroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampoControlErroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampoControlErroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be show a message when has error', () => {
    let alert = fixture.debugElement.query(By.css('.alert'));
    expect(alert).toBeFalsy();

    component.msgErro = `erro${Date.now()}`;
    component.mostrarErro = true;
    fixture.autoDetectChanges();

    alert = fixture.debugElement.query(By.css('.alert'));
    expect(alert).toBeTruthy();
    expect(alert.nativeElement.innerText).toEqual(component.msgErro);
  });
});
