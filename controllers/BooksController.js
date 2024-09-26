const { where } = require('sequelize');
const { Book } = require('../models');
const { Borrow } = require('../models');
const { Member } = require('../models');
const session = require('express-session');

module.exports = {
    async showAllBooks(req, res) {
        try {
            const books = await Book.findAll({
                where: {
                    stock: 1
                }
            });
            res.render('Books', { data: books });
        } catch (err) {
            res.send(err);
        }
    },

    async showMyBooks(req, res) {
        try {
            const myBooks = await Borrow.findAll({
                where: {
                    MCode: req.session.memberCode
                }
            });
            res.render('MyBooks', { data: myBooks });
        } catch (err) {
            res.send(err);
        }
    },

    async borrowBook(req, res) {
        try {
            const checkingMember = await Member.findOne({
                where: {
                    code: req.session.memberCode,
                }
            });
            if (checkingMember.penalizedData) {
                const penalizedDate = new Date(checkingMember.penalizedData);
                const currentDate = new Date();
                const dueDate = new Date(penalizedDate);
                dueDate.setDate(penalizedDate.getDate() + 3);

                if (currentDate <= dueDate) {
                    return res.send('You are penalized, you cannot borrow books');
                } else {
                    await Member.update({
                        penalizedData: null
                    }, {
                        where: {
                            code: req.session.memberCode
                        }
                    });
                }
            }
            const checkingBook = await Borrow.findAll({
                where: {
                    MCode: req.session.memberCode,
                }
            });
            if (checkingBook.length >= 2) {
                return res.send('You have reached the maximum limit of borrowing books');
            }
            const { code } = req.params;
            console.log(code);
            const book = await Book.findOne({
                where: { code }
            });
            if (book.stock > 0) {
                await Book.update({
                    stock: book.stock - 1
                }, {
                    where: { code }
                });
                await Borrow.create({
                    MCode: req.session.memberCode,
                    Bcode: code,
                    borrowedAt: new Date()
                });
                res.redirect('/books');
            } else {
                res.send('Book out of stock');
            }
        } catch (err) {
            res.send(err);
        }
    },

    async returnBook(req, res) {
        try {
            const { code } = req.params;
            const checkingTime = await Borrow.findOne({
                where: {
                    MCode: req.session.memberCode,
                    Bcode: code
                }
            });
            if (checkingTime && checkingTime.borrowedAt) {
                const borrowedDate = new Date(checkingTime.borrowedAt);
                const currentDate = new Date();
                const dueDate = new Date(borrowedDate);
                dueDate.setDate(borrowedDate.getDate() + 7);

                if (currentDate > dueDate) {
                    await Member.update({
                        penalizedData: new Date()
                    }, {
                        where: {
                            code: req.session.memberCode
                        }
                    });
                }
            }
            const book = await Book.findOne({
                where: { code }
            });
            await Book.update({
                stock: book.stock + 1
            }, {
                where: { code }
            });
            await Borrow.destroy({
                where: {
                    MCode: req.session.memberCode,
                    Bcode: code
                }
            });
            res.redirect('/myBooks');
        } catch (err) {
            res.send(err);
        }
    }
}