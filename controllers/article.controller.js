const Article = require("../models/article.model");
const User = require("../models/user.model");
// 防止cross-site scripting
const xss = require("xss");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");
// 刪除本地檔案
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

async function createArticle(req, res, next) {
  let categories;
  try {
    categories = await Article.findCategory();
  } catch (error) {
    next(error);
    return;
  }

  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      title: "",
      content: "",
    };
  }

  res.render("users/articles/createArticle", {
    sessionData: sessionData,
    categories: categories,
  });
}

async function uploadArticle(req, res) {
  if (validation.checkEmpty(req.body.title)) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "標題不可為空, 請輸入適當的標題名稱",
        ...req.body,
      },
      function () {
        res.redirect("/article/createYourArticle");
      }
    );
    return;
  }

  if (validation.checkEmpty(req.body.content)) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "內容不可為空, 請輸入欲分享的內容",
        ...req.body,
      },
      function () {
        res.redirect("/article/createYourArticle");
      }
    );
    return;
  }

  const userId = res.locals.uid;
  const user = await User.findUser(userId);
  let imageFile, imageURL, image;

  if (!req.file) {
    imageFile = "default.jpg";
    imageURL = "https://res.cloudinary.com/dzjktn9na/image/upload/v1677931834/myWeb/default.jpg";
  } else {
    imageFile = req.file.filename;
    image = await cloudinary.uploader.upload(req.file.path, {folder: 'myWeb', public_id: path.parse(imageFile).name});
    //上傳完畢後，將本地的圖片檔案刪除
    await fs.unlinkSync(req.file.path);
  }

  if (!user) {
    res.status(500).render("shared/500");
    return;
  }

  if(!imageURL) {
    imageURL = image.secure_url;
  }

  let article = new Article({
    ...req.body,
    image: imageFile,
    imageURL: imageURL,
    author: user,
    date: new Date(),
  });

  let title = xss(article.title);
  let content = xss(article.content);
  article.content = content;
  article.title = title;

  article.save();
  res.redirect("/");
}

// async function detailArticle(req, res, next) {
//   const articleId = req.params.id;
//   try {
//     const articleData = await Article.findArticleDetail(articleId);
//     const userId = articleData.author._id.toString();
//     res.render("users/articles/article_detail", {
//       articleData: articleData,
//       userId: userId,
//     });
//   } catch (error) {
//     next(error);
//     return;
//   }
// }

async function deleteArticle(req, res, next) {
  const id = req.params.id;
  const articleData = await Article.findArticleDetail(id);

  try {
    const imageName = path.parse(articleData.image).name;
    if (imageName !== 'default') {
      await cloudinary.uploader.destroy('myWeb/' + path.parse(articleData.image).name);
    }
    await Article.deleteArticle(id);
    res.redirect("/");
  } catch (error) {
    next(error);
    return;
  }
}

async function updateArticle(req, res, next) {
  let categories;
  try {
    categories = await Article.findCategory();
  } catch (error) {
    next(error);
    return;
  }

  try {
    const articleData = await Article.findArticleDetail(req.params.id);
    const articleTitle = await Article.findArticleTitle(articleData.category._id);
    res.render("users/articles/updateArticle", {
      categories: categories,
      articleData: articleData,
      articleTitle: articleTitle,
    });
  } catch (error) {
    next(error);
    return;
  }
}

async function updatingArticle(req, res, next) {
  let article;
  let article_image;
  try {
    const user = await User.findUser(req.session.uid);
    article = new Article({
      ...req.body,
      author: user,
      date: new Date(),
      _id: req.params.id,
    });
    article_image = await Article.findArticleDetail(req.params.id);
  } catch (error) {
    next(error);
    return;
  }

  if (req.file) {
    const image = await cloudinary.uploader.upload(req.file.path, {folder:'myWeb', public_id: path.parse(req.file.filename).name});
    await cloudinary.uploader.destroy('myWeb/' + path.parse(article_image.image).name);
    await fs.unlinkSync(req.file.path);
    const imageName = req.file.filename;
    article.replaceImage(imageName, image.secure_url);
  }

  try {
    await article.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/");
}

async function myAllArticles(req, res, next) {
  try {
    let articles = await Article.getMyAllArticles(req.session.uid);
    let articlesTotalLength = Math.ceil(articles.length / 9);
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    if(!page || !limit) {
      page = 1;
      limit = 9;
    }
    articles = await Article.getMyAllArticles(req.session.uid, page, limit);
    res.render('users/articles/my_articles', { articles: articles, totalLength: articlesTotalLength });
  } catch (error) {
    next(error);
    return;
  }
}

module.exports = {
  createArticle: createArticle,
  uploadArticle: uploadArticle,
  deleteArticle: deleteArticle,
  updateArticle: updateArticle,
  updatingArticle: updatingArticle,
  myAllArticles: myAllArticles,
};
