const { Member } = require('../models');

module.exports = {

    async loginForm(req, res) {
        try {
            const { error, emailError, passError } = req.query;
            res.render('Login', { error, emailError, passError });
        } catch (err) {
            res.send(err);
        }
    },

    async postLogin(req, res) {
        try {
            const { code, name } = req.body;
            const member = await Member.findOne({
                where: { code, name }
            });
            if (member) {
                req.session.memberCode = member.code;
                return res.redirect('/');
            } else {
                const passError = `Invalid Code or Name`;
                return res.redirect(`./login?passError=${passError}`);
            }
        } catch (err) {
            res.send(err);
        }
    },

    async logout(req, res) {
        try {
            req.session.destroy();
            res.redirect('/login');
        } catch (err) {
            res.send(err);
        }
    }

}