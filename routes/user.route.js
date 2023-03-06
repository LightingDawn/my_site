const express = require('express');

const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/signup', userController.signup);

router.post('/signup', userController.userSign);

router.get('/login', userController.login);

router.post('/login', userController.userLogin);

router.post('/logout', userController.userLogout);

module.exports = router;