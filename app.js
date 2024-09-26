const express = require('express');
const { loginForm, postLogin, showAllMembers, logout } = require('./controllers/memberController');
const app = express();
const session = require('express-session');
const { showAllBooks, showMyBooks, borrowBook, returnBook } = require('./controllers/BooksController');
const port = 3000;
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: The unique code for the member.
 *     Book:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: The unique code for the book.
 *         stock:
 *           type: integer
 *           description: The number of copies available.
 */

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

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

// Route for handling login submissions
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Handle user login
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user login information.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *             name:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *       401:
 *         description: Invalid Code or Name.
 */
app.post('/login', postLogin);

app.use(function (req, res, next) {
    if (!req.session.memberCode) {
        return res.redirect(`/login`);
    } else {
        next();
    }
});

// Route for the home page
/**
 * @swagger
 * /:
 *   get:
 *     summary: Display the home page
 *     responses:
 *       200:
 *         description: Returns the home page.
 */
app.get('/', (req, res) => {
    res.render('Home');
});

// Route to show all members
/**
 * @swagger
 * /members:
 *   get:
 *     summary: Retrieve all members
 *     responses:
 *       200:
 *         description: A list of members.
 */
app.get('/members', showAllMembers);

// Route to show all books
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     responses:
 *       200:
 *         description: A list of books.
 */
app.get('/books', showAllBooks);

// Route for borrowing a book (POST request)
/**
 * @swagger
 * /borrow/{code}:
 *   post:
 *     summary: Borrow a book
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         description: The unique code of the book to borrow.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book borrowed successfully.
 *       400:
 *         description: Member penalized.
 */
app.post('/borrow/:code', borrowBook);

// Route to show the books borrowed by the user
/**
 * @swagger
 * /myBooks:
 *   get:
 *     summary: Retrieve the books borrowed by the user
 *     responses:
 *       200:
 *         description: A list of books borrowed by the user.
 */
app.get('/myBooks', showMyBooks);

// Route for returning a borrowed book (POST request)
/**
 * @swagger
 * /return/{code}:
 *   post:
 *     summary: Return a borrowed book
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         description: The unique code of the book to return.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully.
 */
app.post('/return/:code', returnBook);

// Route for logging out
/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out the current user
 *     responses:
 *       200:
 *         description: Successfully logged out.
 */
app.get('/logout', logout);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
