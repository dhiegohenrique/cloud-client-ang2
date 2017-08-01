import { browser, by, element } from 'protractor';

export class CloudCliAngPage {
  navigateTo() {
    return browser.get('/');
  }

  waitUrl(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      var EC = browser.ExpectedConditions;
      browser.wait(EC.urlContains(url.toLowerCase()), 2000); 

      browser.getCurrentUrl().then((currentUrl) => {
        expect(currentUrl.toLowerCase()).toContain(url.toLowerCase());
        resolve();
      });  
    });
  }

  login = (username: string, password: string) => {
    const inputUsername = element(by.id('username'));
    inputUsername.sendKeys(username);
    
    const inputPassword = element(by.id('password'));
    inputPassword.sendKeys(password);
    
    const btnLogin = element(by.id('login'));
    return btnLogin.click();
  }

  insertPerson = (name: string, username: string, password: string) => {
    const inputName = element(by.id('name'));
    inputName.clear();
    inputName.sendKeys(name);
    
    const inputUsername = element(by.id('username'));
    inputUsername.isEnabled().then((isEnabled) => {
      if (isEnabled) {
        inputUsername.clear();
        inputUsername.sendKeys(username);
      }
    });

    const inputPassword = element(by.id('password'));
    inputPassword.clear();
    inputPassword.sendKeys(password);

    const btnCadastrar = element(by.css(`button[type="submit"]`));
    return btnCadastrar.click();
  };
}
