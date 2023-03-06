const express = require('express');

const homeController = require('../controllers/home.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();

router.get('/', homeController.backHome);

router.get('/article_detail/:id', imageUploadMiddleware, homeController.detailArticle);

router.get('/lifestyle', homeController.lifestyleArticle);

router.get('/diary', homeController.diaryArticle);

router.get('/interest', homeController.interestArticle);

router.get('/creation', homeController.creationArticle);

router.get('/others', homeController.othersArticle);

router.get('/401', homeController.errorPage_401);

router.get('/403', homeController.errorPage_403);

router.get('/500', homeController.errorPage_500);

module.exports = router;