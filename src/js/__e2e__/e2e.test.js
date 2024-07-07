import puppetteer from 'puppeteer';
import { CardValidatorWidget } from '../widget';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);

    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      // headless: false, // show gui
      // slowMo: 250,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  describe('CardValidatorWidget', () => {
    // eslint-disable-next-line jest/expect-expect
    test('Opening the main page', async () => {
      await page.goto(baseUrl);
      await page.waitFor('body');
    });

    // eslint-disable-next-line jest/expect-expect
    test('Must add class valid if the number is valid', async () => {
      await page.goto(baseUrl);
      await page.waitFor(CardValidatorWidget.selector);

      const form = await page.$(CardValidatorWidget.formSelector);
      const input = await form.$(CardValidatorWidget.inputSelector);
      const submitter = await form.$(CardValidatorWidget.submitterSelector);

      await input.type('4539499701100246');
      submitter.click();

      await page.waitForSelector(CardValidatorWidget.inputSelector + '.valid');
    });

    // eslint-disable-next-line jest/expect-expect
    test('Must add class invalid if the number is not valid', async () => {
      await page.goto(baseUrl);
      await page.waitFor(CardValidatorWidget.selector);

      const form = await page.$(CardValidatorWidget.formSelector);
      const input = await form.$(CardValidatorWidget.inputSelector);
      const submitter = await form.$(CardValidatorWidget.submitterSelector);

      await input.type('4539499701100247');
      submitter.click();

      await page.waitForSelector(CardValidatorWidget.inputSelector + '.invalid');
    });
  });
});
