const express = require('express');
const { loginForm, postLogin } = require('./controllers/memberController');
const app = express()
const session = require('express-session');
const port = 3000

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'rahasia',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}));

app.get('/login', loginForm);
app.post('/login', postLogin);

app.use(function (req, res, next) {
    if (!req.session.memberCode) {
       return res.redirect(`/login`)
    } else {
        next()
    }
})

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})