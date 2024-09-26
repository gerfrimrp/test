const express = require('express');
const { loginForm, postLogin, showAllMembers, logout } = require('./controllers/memberController');
const app = express()
const session = require('express-session');
const { showAllBooks, showMyBooks, borrowBook, returnBook } = require('./controllers/BooksController');
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
    res.render('Home');
});

app.get('/members', showAllMembers);
app.get('/books', showAllBooks);
app.post('/borrow/:code', borrowBook);
app.get('/myBooks', showMyBooks);
app.post('/return/:code', returnBook);
app.get('/logout', logout);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})