import { CloudCliAngPage } from './app.po';
import { browser, element, by } from "protractor/built";

describe('cloud-cli-ang App', () => {
  let page: CloudCliAngPage;
  const timestamp = Date.now();

  beforeEach(() => {
    page = new CloudCliAngPage();
    page.navigateTo();
    navigateToPersonPage();
  });

  const navigateToPersonPage = () => {
    const btnCadastrar = element(by.id('cadastrar'));
    btnCadastrar.click();
  }

  it('should be show a message when a required field is blank', () => {
    const btnCadastrar = element(by.id('cadastrar'));
    btnCadastrar.click();
    
    const appCampoControlErro = element(by.tagName('app-campo-control-erro'));
    expect(appCampoControlErro.isPresent()).toBe(true);
  });

  it('should be navigate to home page when the person successfully registered', () => {
    page.insertPerson(`name${timestamp}`, `username${timestamp}`, `password${timestamp}`).then(() => {
      const callback = (url) => {
      }

      page.waitUrl('home');
    });
  });

  it('should be show a message when username exists', () => {
    page.insertPerson(`name${timestamp}`, `username${timestamp}`, `password${timestamp}`).then(() => {
      const appStatusMessage = element(by.tagName('app-status-message'));
      expect(appStatusMessage.isPresent()).toBe(true);
    });
  });
});
