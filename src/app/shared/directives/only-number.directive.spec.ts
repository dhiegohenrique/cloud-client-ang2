import { OnlyNumberDirective } from './only-number.directive';
import * as keycodes from 'keycodes';

describe('OnlyNumberDirective', () => {

  let event: Event;
  let spy;
  let directive;

  beforeEach(() => {
    event = new Event('keydown');
    spy = spyOn(event, 'preventDefault');
    directive = new OnlyNumberDirective(null);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should be permit input only numbers', () => {
    Object.defineProperty(event, 'keyCode', { 'value': keycodes('1') });
    directive.onKeyDown(event);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should be not permit an entry other than a number', () => {
    Object.defineProperty(event, 'keyCode', { 'value': keycodes('a') });
    directive.onKeyDown(event);
    expect(spy).toHaveBeenCalled();
  });
});
