const db = require("../data/database");
const mongodb = require("mongodb");

class Article {
  // constructor(title, category, content, author, date, image) {
  //   this.title = title;
  //   this.category = category;
  //   this.content = content;
  //   this.author = author;
  //   this.date = new Date(date);
  //   if (this.date) {
  //     this.formattedDate = this.date.toLocaleDateString("zh-TW", {
  //       weekday: "short",
  //       day: "numeric",
  //       month: "long",
  //       year: "numeric",
  //     });
  //   }
  //   this.image = image;
  //   this.imagePath = `upload_image/images/${image}`;
  //   this.imageURL = `/cover/images/images/${image}`;
  // }

  constructor(articleData) {
    this.title = articleData.title;
    this.category = articleData.myCategory;
    this.content = articleData.content;
    this.image = articleData.image;
    // this.imagePath = `upload_image/images/${articleData.image}`;
    this.imageURL = articleData.imageURL;
    this.author = articleData.author;
    this.date = articleData.date;
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString("zh-TW", {
        second: 'numeric',
        minute: 'numeric',
        hour: 'numeric',
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    if (articleData._id) {
      this.id = articleData._id.toString();
    }
  }

  static async findCategory() {
    try {
      const category = await db
        .getDb()
        .collection("article_title")
        .find({})
        .toArray();
      return category;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  static async getAllArticles(page, limit) {
    if (!page && !limit) {
      try {
        const articles = await db
          .getDb()
          .collection("articles")
          .find({})
          .toArray();
        return articles;
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      try {
        const articles = await db
          .getDb()
          .collection("articles")
          .find({})
          .limit(limit)
          .skip((page - 1) * limit)
          .sort({date:-1})
          .toArray();
        return articles;
      } catch (error) {
        console.log(error);
        return;
      }
    }
  }

  static async getMyAllArticles(id, page, limit) {
    if (!page && !limit) {
      try {
        const userId = new mongodb.ObjectId(id);
        const userArticles = await db
          .getDb()
          .collection("articles")
          .find({ "author._id": userId })
          .sort({ date: -1 })
          .toArray();
        return userArticles;
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      try {
        const userId = new mongodb.ObjectId(id);
        const userArticles = await db
          .getDb()
          .collection("articles")
          .find({ "author._id": userId })
          .limit(limit)
          .skip((page - 1) * limit)
          .sort({ date: -1 })
          .toArray();
        return userArticles;
      } catch (error) {
        console.log(error);
        return;
      }
    }
  }

  static async deleteArticle(id) {
    const articleId = new mongodb.ObjectId(id);
    if (!articleId) {
      console.log("沒有這篇文章");
      return;
    } else {
      return await db
        .getDb()
        .collection("articles")
        .deleteOne({ _id: articleId });
    }
  }

  static async findArticleDetail(id) {
    let articleId;
    try {
      articleId = new mongodb.ObjectId(id);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const articleData = await db
      .getDb()
      .collection("articles")
      .findOne({ _id: articleId });

    if (!articleData) {
      const error = new Error("沒有此篇文章存在");
      error.code = 404;
      throw error;
    }

    return articleData;
  }

  static async findArticleTitle(id) {
    try {
      const titleId = new mongodb.ObjectId(id);
      return await db
        .getDb()
        .collection("article_title")
        .findOne({ _id: titleId });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  static async findSingleCategory(title, page, limit) {
    if (!page && !limit) {
      try {
        const articles = await db
          .getDb()
          .collection("articles")
          .find({ "category.title": title })
          .toArray();
        return articles;
      } catch (error) {
        return console.log(error);
      }
    } else {
      try {
        const articles = await db
          .getDb()
          .collection("articles")
          .find({ "category.title": title })
          .limit(limit)
          .skip((page - 1) * limit)
          .toArray();
        return articles;
      } catch (error) {
        return console.log(error);
      }
    }
  }

  async save() {
    const categoryId = new mongodb.ObjectId(this.category);
    const categoryName = await db
      .getDb()
      .collection("article_title")
      .findOne({ _id: categoryId });
    const articleData = {
      title: this.title,
      category: categoryName,
      content: this.content,
      author: this.author,
      date: this.formattedDate,
      image: this.image,
      imageURL: this.imageURL,
    };

    if (this.id) {
      const articleId = new mongodb.ObjectId(this.id);

      if (!this.image) {
        delete articleData.image;
        delete articleData.imageURL;
      }

      await db
        .getDb()
        .collection("articles")
        .updateOne({ _id: articleId }, { $set: articleData });
    } else {
      try {
        const article = await db
          .getDb()
          .collection("articles")
          .insertOne(articleData);
        return article;
      } catch (error) {
        console.log(error);
        return;
      }
    }
  }

  async replaceImage(name, url) {
    this.image = name;
    this.imageURL = url;
  }
}

module.exports = Article;
