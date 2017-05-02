const express = require('express');
const router = express.Router();
const models = require('../models');
const { Page, User } = models;
module.exports = router;

//every time we get to middleware that refers to the param `urlTitle` this middleware will run.
// http://expressjs.com/en/api.html#router.param
router.param('urlTitle', (req, res, next, titleParam) => {
    Page.findOne({
            where: {
                urlTitle: titleParam
            }
        })
        .then((page) => {
            if (!page) {
                let err = new Error('urlTitle could not be found');
                err.status = 404;
                throw err;
            }
            //now we are going to add this sequelize instance to our request so we can use it in the middleware that follows
            req.page = page;
            next();
        })
        .catch(next);
})

// /wiki
router.get('/', (req, res, next) => {

    Page.findAll({})
        .then(pages => res.render('index', { pages }))
        .catch(next);

});

// /wiki
router.post('/', (req, res, next) => {

    Promise.all([
            Page.create(req.body),
            User.findOrCreate({
                where: {
                    name: req.body.name,
                    email: req.body.email
                }
            })
        ])
        //destructuring assignment. Giving each element in the array a variable name. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        .then(([createdPage, [theUser, createdUserBool]]) => createdPage.setAuthor(theUser))
        .then(authoredPage => res.redirect(authoredPage.route))
        .catch(next);

});

router.get('/search', (req, res, next) => {

    Page.findByTag(req.query.search)
        .then(pages => res.render('index', { pages }))
        .catch(next);

});

router.post('/:urlTitle', function(req, res, next) {

    req.page.update(req.body)
        .then(updatedPage => {
            res.redirect(updatedPage.route)
        })
        .catch(next);

});

router.get('/:urlTitle/delete', function(req, res, next) {

    req.page.destroy()
        .then(() => res.redirect('/wiki'))
        .catch(next);

});

// /wiki/add
router.get('/add', (req, res) => res.render('addpage'));

// /wiki/(dynamic value)
router.get('/:urlTitle', (req, res, next) => {

    res.render('wikipage', { page: req.page });

});

router.get('/:urlTitle/edit', function(req, res, next) {

    res.render('editpage', { page: req.page });

});

// /wiki/(dynamic value)
router.get('/:urlTitle/similar', function(req, res, next) {

    req.page.findSimilar()
        .then(pages => res.render('index', { pages }));

});
