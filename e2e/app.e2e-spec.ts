import { CloudCliAngPage } from './app.po';
import { browser } from "protractor/built";

describe('cloud-cli-ang App', () => {
  let page: CloudCliAngPage;

  beforeEach(() => {
    page = new CloudCliAngPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    browser.getTitle().then(function(title) {
      expect(title.toLowerCase()).toEqual('cloud client');
    });
  });
});
