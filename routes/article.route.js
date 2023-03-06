const express = require('express');

const articleController = require('../controllers/article.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();

router.get('/createYourArticle', articleController.createArticle);

router.post('/createYourArticle', imageUploadMiddleware, articleController.uploadArticle);

router.post('/article_detail/delete/:id', articleController.deleteArticle);

router.get('/updateYourArticle/:id', imageUploadMiddleware, articleController.updateArticle);

router.post('/updateYourArticle/:id', imageUploadMiddleware, articleController.updatingArticle);

router.get('/myAllArticles', imageUploadMiddleware, articleController.myAllArticles);

module.exports = router;