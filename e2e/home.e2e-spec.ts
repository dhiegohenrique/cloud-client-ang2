import { CloudCliAngPage } from './app.po';
import { browser, element, by, ElementFinder } from "protractor/built";

describe('cloud-cli-ang App', () => {
  let page: CloudCliAngPage;
  let timestamp;

  beforeEach(() => {
    page = new CloudCliAngPage();
    page.navigateTo();

    timestamp = Date.now();
  });

  it('should be show a message when update the person', () => {
    login().then(() => {
      page.insertPerson('Dhiego', 'dhiego.henrique', '123qwe').then(() => {
        validateMessageSuccess();
      });
    });
  });

  it('should be insert a new cloud', () => {
    const name = `cloud${timestamp}`;
    insertCloud(name, 'windows', 10, false).then(() => {
      getCloudByName(name);
    });
  });

  it('should be load the cloud data', () => {
    const name = `cloud${timestamp}`;
    const operationalSystem = `linux${timestamp}`;
    const capacity = 10;
    const active = false;

    insertAndLoadCloud(name, operationalSystem, capacity, active).then(() => {
      validateCloudData(name, operationalSystem, capacity, active);
    });
  });

  it('should be show a message when update the cloud', () => {
    let name = `cloud${timestamp}`;
    const operationalSystem = `windows${timestamp}`;
    const capacity = 10;
    const active = false;

    const updateCloud = () => {
      fillInCloudForm(name, operationalSystem, capacity, active).then(() => {
        validateMessageSuccess();
      });
    };

    insertCloud(name, operationalSystem, capacity, active).then(() => {
      getCloudByName(name).then((cloud: ElementFinder) => {
        cloud.click().then(() => {
          name+= ' - editado';
          updateCloud();
        });
      });
    });
  });

  it('should be show the confirmation and delete the cloud', () => {
    let name = `cloud${timestamp}`;
    const operationalSystem = `linux${timestamp}`;
    const capacity = 10;
    const active = false;

    insertCloud(name, operationalSystem, capacity, active).then(() => {
      deleteCloud(name);
    });
  });

  const confirmDeleteCloud = (name: string) => {
    browser.sleep(500);
    element(by.buttonText('Confirmar')).click().then(() => {
      const cloudDeleted = element(by.linkText(name));
      cloudDeleted.isPresent().then((isPresent) => {
        expect(isPresent).toBe(false);
      });
    });
  };

  const deleteCloud = (name: string) => {
    getCloudByName(name).then((cloud: ElementFinder) => {
      const btnDelete = cloud.element(by.id('delete'));
      btnDelete.click().then(() => {
        confirmDeleteCloud(name);
      });
    });
  };

  const insertAndLoadCloud = (name: string, operationalSystem: string, capacity: number, active: boolean) => {
    return new Promise((resolve, reject) => {
      insertCloud(name, operationalSystem, capacity, active).then(() => {
        getCloudByName(name).then((cloud: ElementFinder) => {
          cloud.click().then(() => {
            resolve();
          });
        });
      });
    });
  };

  const validateMessageSuccess = () => {
    const messageSuccess = element(by.xpath("//div[contains(@class,'success')]"));
    expect(messageSuccess.isPresent()).toBe(true);
  }

  const insertCloud = (name: string, operationalSystem: string, capacity: number, active: boolean) => {
    return new Promise((resolve, reject) => {
      login().then(() => {
        const btnNewCloud = element(by.id('nova'));
        btnNewCloud.click().then(() => {
          fillInCloudForm(name, operationalSystem, capacity, active).then(() => {
            resolve();
          });
        });
      });
    });
  };

  const validateCloudData = (name: string, operationalSystem: string, capacity: number, active: boolean) => {
    const map = getCloudForm();
    validateInput(map.get('name'), name);
    validateInput(map.get('operationalSystem'), operationalSystem);
    validateInput(map.get('capacity'), capacity.toString());

    const radiosActive = map.get('active');
    const radio: ElementFinder = radiosActive.get(active ? 0 : 1);

    radio.getAttribute("checked").then((checked: string) => {
      expect(new Boolean(checked)).toEqual(true);
    });

    expect(map.get('createDate').isPresent()).toBe(true);
    expect(map.get('updateDate').isPresent()).toBe(true);
  };

  const validateInput = (input: ElementFinder, value: string) => {
    input.getAttribute('value').then((inputValue) => {
      expect(inputValue).toEqual(value);
    });
  };

  const login = () => {
    return new Promise((resolve, reject) => {
      page.login('dhiego.henrique', '123qwe').then(() => {
        page.waitUrl('home').then(() => {
          resolve();
        });
      });
    });
  };

  const getCloudByName = (name: string) => {
    return new Promise((resolve, reject) => {
      const cloud = element(by.linkText(name));
      cloud.isPresent().then((isPresent) => {
        expect(isPresent).toBe(true);
        if (isPresent) {
          resolve(cloud);
        } else {
          reject();
        }
      });
    });
  };

  const countClouds = () => {
    const clouds = element.all(by.tagName('a'));
    return clouds.count();
  }

  const fillInCloudForm = (name: string, operationalSystem: string, capacity: number, active: boolean) => {
    const map = getCloudForm();
    map.get('name').clear().sendKeys(name);
    map.get('operationalSystem').clear().sendKeys(operationalSystem);
    map.get('capacity').clear().sendKeys(capacity);

    const radiosActive = map.get('active');
    radiosActive.get(active ? 0 : 1).click();
    
    return map.get('salvar').click();
  }

  const getCloudForm = () => {
    const map = new Map<string, any>();
    
    const cloudForm = element(by.id('cloud-form'));
    const inputName = cloudForm.element(by.id('name'));
    map.set('name', inputName);

    const inputOperationalSystem = cloudForm.element(by.id('operationalSystem'));
    map.set('operationalSystem', inputOperationalSystem);

    const inputCapacity = cloudForm.element(by.id('capacity'));
    map.set('capacity', inputCapacity);

    const radiosActive = cloudForm.all(by.css(`input[type="radio"]`));
    map.set('active', radiosActive);

    const inputCreateDate = element(by.id('createDate'));
    map.set('createDate', inputCreateDate);

    const inputUpdateDate = element(by.id('updateDate'));
    map.set('updateDate', inputUpdateDate);

    const btnSalvar = cloudForm.element(by.id('salvar'));
    map.set('salvar', btnSalvar);

    return map;
  };
});
