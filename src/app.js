const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const {USER} = require("./database/models/USER");
const saltRounds = 10;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/components'),
}));


app.set('view engine', 'handlebars');
app.set('views', './views/');

app.get('/', (req, res) => {
    res.render('home', {user: req.session.user });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await USER.findOne({ where: { EMAIL: email } });
        if (!user) {
            return res.render('result', {
                message: "Пользователь не найден"
            });
        }
        const match = await bcrypt.compare(password, user.PASSWORD);

        if (!match) {
            return res.render('result', {
                message: "Неправильный пароль"
            });
        }
        req.session.user = user;
        if(user.IS_SELLER) {
            res.render('sale', {
                email: user.EMAIL
            });
        } else {
            res.render('bonus', {
                email: user.EMAIL,
                bonuses: user.NUMBER_OF_BONUSES,
                code: user.UNIQUE_CODE,
                registration_date: user.REGISTRATION_DATE
            });
        }
    } catch (error) {
        console.error(error);
        res.render('result', {
            message: "Произошла ошибка при входе в систему"
        });
    }
});

app.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const isSeller = req.body.type === "Продавец";

    const uniqueCode = [...Array(6)].map(() => Math.random().toString(36)[2].toUpperCase()).join('');

    try {
        const existingUser = await USER.findOne({ where: { EMAIL: email } });
        if (existingUser) {
            return res.render('result', {
                message: "Пользователь с таким email уже существует."
            });
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await USER.create({
            EMAIL: email,
            PASSWORD: hashedPassword,
            SALT: salt,
            IS_SELLER: isSeller,
            NUMBER_OF_BONUSES: 0,
            UNIQUE_CODE: uniqueCode
        });

        req.session.user = newUser;
        if(newUser.IS_SELLER) {
            res.render('sale', {
                email: newUser.EMAIL
            });
        } else {
            res.render('bonus', {
                email: newUser.EMAIL,
                bonuses: newUser.NUMBER_OF_BONUSES,
                code: newUser.UNIQUE_CODE
            });
        }
    } catch (error) {
        console.error(error);
        return res.render('result', {
            message: "Произошла ошибка при регистрации пользователя."
        });
    }
});


app.post('/charge', async (req, res) => {
    const code_from = req.body.code_from; // Уникальный код пользователя
    const quantity_rub = parseFloat(req.body.quantity_rub); // Сумма в рублях для начисления
    const quantity_bonuses = quantity_rub * 100;
    try {
        const user = await USER.findOne({ where: { UNIQUE_CODE: code_from } });

        if (!user) {
            return;
            // return res.render('result', {
            //     message: "Пользователь не найден."
            // });
        }
        user.NUMBER_OF_BONUSES += quantity_bonuses;

        await user.save();
        // res.render('result', {
        //     message: "Бонусы успешно начислены."
        // });
    } catch (error) {
        console.error(error);
        // res.render('result', {
        //     message: "Произошла ошибка при начислении бонусов."
        // });
    }
});


app.post('/write-off', async (req, res) => {
    const code_to = req.body.code_to; // Уникальный код пользователя
    const quantity_bonuses = parseInt(req.body.quantity_bonuses, 10); // Количество бонусов для списания

    try {
        const user = await USER.findOne({ where: { UNIQUE_CODE: code_to } });

        if (!user) {
            return ;
            // return res.render('result', {
            //     message: "Пользователь не найден."
            // });
        }

        if (user.NUMBER_OF_BONUSES < quantity_bonuses) {
            return;
            // return res.render('result', {
            //     message: "Недостаточно бонусов для списания."
            // });
        }

        user.NUMBER_OF_BONUSES -= quantity_bonuses;
        await user.save();
        return;
        // res.render('result', {
        //     message: "Бонусы успешно списаны."
        // });
    } catch (error) {
        console.error(error);
        // res.render('result', {
        //     message: "Произошла ошибка при списании бонусов."
        // });
    }
});


app.get('/not-found', (req, res) => {
    res.render('notfound');
});
app.get('*', (req, res) => {
    res.redirect('not-found');
});



// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
