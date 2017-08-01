import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusMessageComponent } from './status-message.component';
import { By } from "@angular/platform-browser";

describe('StatusMessageComponent', () => {
  let component: StatusMessageComponent;
  let fixture: ComponentFixture<StatusMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be show a message of success with a message default', () => {
    let alert = fixture.debugElement.query(By.css('.alert'));
    expect(alert).toBeFalsy();

    component.success = true;
    fixture.autoDetectChanges();

    alert = fixture.debugElement.query(By.css('.alert'));
    expect(alert).toBeTruthy();
    
    const element: HTMLElement = alert.nativeElement;
    expect(element.classList.contains('alert-success')).toBeTruthy();
  });

  it('should be show a message of success with a message custom', () => {
    const message: string = 'mensagem de sucesso';
    let alert = fixture.debugElement.query(By.css('.alert'));
    expect(alert).toBeFalsy();

    component.success = true;
    component.message = message;
    fixture.autoDetectChanges();

    alert = fixture.debugElement.query(By.css('.alert'));
    expect(alert).toBeTruthy();
    
    const element: HTMLElement = alert.nativeElement;
    expect(element.classList.contains('alert-success')).toBeTruthy();
    expect(element.innerText).toEqual(message);
  });

  it('should be show a message of fail with a message default', () => {
    let alert = fixture.debugElement.query(By.css('.alert'));
    expect(alert).toBeFalsy();

    component.success = false;
    fixture.autoDetectChanges();

    alert = fixture.debugElement.query(By.css('.alert'));
    expect(alert).toBeTruthy();
    
    const element: HTMLElement = alert.nativeElement;
    expect(element.classList.contains('alert-danger')).toBeTruthy();
  });

  it('should be show a message of fail with a message custom', () => {
    const message: string = 'mensagem de falha';
    let alert = fixture.debugElement.query(By.css('.alert'));
    expect(alert).toBeFalsy();

    component.success = false;
    component.message = message;
    fixture.autoDetectChanges();

    alert = fixture.debugElement.query(By.css('.alert'));
    expect(alert).toBeTruthy();
    
    const element: HTMLElement = alert.nativeElement;
    expect(element.classList.contains('alert-danger')).toBeTruthy();
    expect(element.innerText).toEqual(message);
  });
});
