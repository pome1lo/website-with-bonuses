const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
