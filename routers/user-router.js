const express = require('express');
const { check } = require('express-validator')
const { checkJwt } = require('../model/check-jwt')
const userControllers = require('../controller/user-controller');

const router = express.Router();

router.get('/',userControllers.getUsers);

router.post(
    '/signup', 
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 6})
    ],
    userControllers.signup);

router.post(
    '/login', 
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 6})
    ],
    userControllers.login)

router.post('/logout', checkJwt,userControllers.logout)


module.exports = router;