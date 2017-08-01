import { CloudCliAngPage } from './app.po';
import { browser, element, by } from "protractor/built";

describe('cloud-cli-ang App', () => {
  let page: CloudCliAngPage;

  beforeEach(() => {
    page = new CloudCliAngPage();
    page.navigateTo();
  });

  it('should be show a message when a required field is blank', () => {
    const btnLogin = element(by.buttonText('Login'));
    btnLogin.click();
    
    const appCampoControlErro = element(by.tagName('app-campo-control-erro'));
    expect(appCampoControlErro.isPresent()).toBe(true);
  });

  it('should be navigate to home page when login is successful', () => {
   page.login('dhiego.henrique', '123qwe').then(() => {
      page.waitUrl('home');
    });
  });

  it('should be show a message when the username or password is incorrect', () => {
    page.login('dhiego.henrique', 'minhasenha').then(() => {
      const appStatusMessage = element(by.tagName('app-status-message'));
      expect(appStatusMessage.isPresent()).toBe(true);
    });
  });
});
