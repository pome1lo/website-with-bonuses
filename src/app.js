const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();

app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/components'),
}));

app.set('view engine', 'handlebars');
app.set('views', './views/');

// Создание маршрута для главной страницы
app.get('/', (req, res) => {
    res.render('home', { message: 'Привет от Handlebars!' });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
