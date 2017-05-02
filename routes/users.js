const express = require('express');
const router = express.Router();
const models = require('../models');
const {Page, User} = models;
module.exports = router;

// /users
router.get('/', function (req, res, next) {

    User.findAll({})
        .then(users => res.render('userlist', {users}))
        .catch(next);

});

// /users/(dynamicvalue)
router.get('/:userId', function ({params: {userId}}, res, next) {

    const findUser = User.findById(userId);

    const findPages = Page.findAll({
        where: {
            authorId: userId
        }
    });

    Promise.all([findUser, findPages])
        //destructuring assignment. Giving each element in the array a variable name. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        .then(([user, pages]) => {
            res.render('userpages', {pages, user})
        })
        .catch(next);

});