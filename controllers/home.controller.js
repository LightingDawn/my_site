const Article = require('../models/article.model');

async function backHome(req, res) {
  let articles = await Article.getAllArticles();
  const totalLength = Math.ceil((articles.length) / 9);
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!page || !limit){
    page = 1;
    limit = 9;
  }
  articles = await Article.getAllArticles(page, limit);
  res.render('base/home', {articles: articles, totalLength: totalLength});
}

async function detailArticle(req, res, next) {
  const articleId = req.params.id;
  try {
    const articleData = await Article.findArticleDetail(articleId);
    const userId = articleData.author._id.toString();
    res.render("users/articles/article_detail", {
      articleData: articleData,
      userId: userId,
    });
  } catch (error) {
    next(error);
    return;
  }
}

async function lifestyleArticle(req, res, next) {
  let lifestyleArticles = await Article.findSingleCategory('生活休閒');
  let totalLength = Math.ceil((lifestyleArticles.length) / 9);
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!page && !limit) {
    page = 1;
    limit = 9;
  }
  lifestyleArticles = await Article.findSingleCategory('生活休閒', page, limit);
  res.render('base/lifestyle', {lifestyleArticles:lifestyleArticles, totalLength:totalLength});
}

async function diaryArticle(req, res, next) {
  let diary = await Article.findSingleCategory('心情日誌');
  let totalLength = Math.ceil((diary.length) / 9);
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!page && !limit) {
    page = 1;
    limit = 9;
  }
  diary = await Article.findSingleCategory('心情日誌', page, limit);
  res.render('base/diary', {diary:diary, totalLength:totalLength});
}

async function interestArticle(req, res, next) {
  let interest = await Article.findSingleCategory('興趣嗜好');
  let totalLength = Math.ceil((interest.length) / 9);
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!page && !limit) {
    page = 1;
    limit = 9;
  }
  interest = await Article.findSingleCategory('興趣嗜好', page, limit);
  res.render('base/interest', {interest:interest, totalLength:totalLength});
}

async function creationArticle(req, res, next) {
  let mycreation = await Article.findSingleCategory('個人創作');
  let totalLength = Math.ceil((mycreation.length) / 9);
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!page && !limit) {
    page = 1;
    limit = 9;
  }
  mycreation = await Article.findSingleCategory('個人創作', page, limit);
  res.render('base/personal_creation', {mycreation:mycreation, totalLength:totalLength});
}

async function othersArticle(req, res, next) {
  let others = await Article.findSingleCategory('其他');
  let totalLength = Math.ceil((others.length) / 9);
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!page && !limit) {
    page = 1;
    limit = 9;
  }
  others = await Article.findSingleCategory('其他', page, limit);
  res.render('base/others', {others:others, totalLength:totalLength});
}

function errorPage_401(req, res) {
  res.render('shared/401');
}

function errorPage_403(req, res) {
  res.render('shared/403');
}

function errorPage_500(req,res) {
  res.render('shared/500');
}

module.exports = {
  backHome: backHome,
  errorPage_401: errorPage_401,
  errorPage_403: errorPage_403,
  errorPage_500: errorPage_500,
  detailArticle: detailArticle,
  lifestyleArticle: lifestyleArticle,
  diaryArticle: diaryArticle,
  interestArticle: interestArticle,
  creationArticle: creationArticle,
  othersArticle: othersArticle
};