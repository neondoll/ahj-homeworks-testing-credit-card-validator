const puppeteer = require('puppeteer'); // Подключаем библиотеку Puppeteer для автоматизации браузера

// Описываем группу тестов для e2e тестирования валидатора кредитных карт
describe('Credit Card Validator E2E Tests', () => {
  let browser;
  // let page;
  const baseUrl = 'http://localhost:9000';

  // Функция, которая выполняется перед всеми тестами
  beforeAll(async () => {
    // Запускаем браузер
    browser = await puppeteer.launch({
      headless: false, // Установите true, если не нужен видимый браузер (безголовый режим)
      slowMo: 50, // Замедляем выполнение на 50ms чтобы видеть взаимодействие
      // devtools: true,
    });
  });
  // Функция, которая выполняется после всех тестов
  afterAll(async () => {
    // Закрываем браузер
    await browser.close();
  });

  // Тестируем валидацию корректного номера карты
  test('Valid card number validation', async () => {
    // Открываем новую страницу в браузере
    const page = await browser.newPage();

    // Переходим на локальный сервер (убедитесь, что сервер запущен на порту 9000)
    await page.goto(baseUrl);

    // Вводим корректный номер карты в инпут
    await page.type('.card-validator-widget__input', '5586200023405365');

    // Нажимаем на кнопку валидации
    await page.click('.card-validator-widget__btn');

    // Ждем, пока появится сообщение о валидности карты
    await page.waitForSelector('.card-validator-widget__message.valid');

    // Извлекаем текст сообщения
    const message = await page.$eval('.card-validator-widget__message', el => el.textContent);

    // Проверяем, что сообщение соответствует ожидаемому
    expect(message).toBe('The card is valid, MasterCard payment system.');
  });

  // Тестируем валидацию некорректного номера карты
  test('Invalid card number validation', async () => {
    // Открываем новую страницу в браузере
    const page = await browser.newPage();

    // Переходим на локальный сервер (убедитесь, что сервер запущен на порту 9000)
    await page.goto(baseUrl);

    // Вводим некорректный номер карты в инпут
    await page.type('.card-validator-widget__input', '5586200023405366');

    // Нажимаем на кнопку валидации
    await page.click('.card-validator-widget__btn');

    // Ждем, пока появится сообщение о невалидности карты
    await page.waitForSelector('.card-validator-widget__message.invalid');

    // Извлекаем текст сообщения
    const message = await page.$eval('.card-validator-widget__message', el => el.textContent);

    // Проверяем, что сообщение соответствует ожидаемому
    expect(message).toBe('The card is not valid');
  });
});
