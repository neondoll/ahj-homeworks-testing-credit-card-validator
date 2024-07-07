const webpack = require('webpack'); // Импортируем Webpack для компиляции
const WebpackDevServer = require('webpack-dev-server'); // Импортируем Webpack Dev Server для создания и управления сервером разработки
const config = require('../../../webpack.dev.js'); // Загружаем файл конфигурации Webpack

const options = config.devServer || {}; // Получаем опции для Dev Server из конфигурации Webpack
const compiler = webpack(config); // Создаём компилятор Webpack с загруженной конфигурацией
const server = new WebpackDevServer(options, compiler); // Создаём сервер разработки с использованием компилятора и опций

// Запускаем сервер и выводим сообщение, когда сервер успешно запущен
server.startCallback(() => {
  console.log('------- Webpack Dev Server is running -------');

  if (process.send) {
    process.send('ok');
  }
});

// server.listen(9000, 'localhost', (err) => {
//  if (err) {
//    return;
//  }
//
//  if (process.send) {
//    process.send('ok');
//  }
// });
