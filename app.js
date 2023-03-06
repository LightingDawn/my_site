const path = require("path");

const express = require("express");
const expressSession = require('express-session');
const csrf = require('csurf');

let port = 3000;

if(process.env.PORT) {
  port = process.env.PORT;
}

const createSessionConfig = require('./config/session');
const errorHandlerMiddleware = require('./middlewares/error_handler');
const csrfTokenMiddleware = require('./middlewares/csrfToken');
const checkAuth = require('./middlewares/checkAuth');
const protectRouteMiddleware = require('./middlewares/protect-routes');
const notFoundMiddleware = require('./middlewares/notFound');
const db = require("./data/database");
const baseRoute = require("./routes/base.route");
const userRoute = require("./routes/user.route");
const articleRoute = require('./routes/article.route');

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));
app.use('/cover/images', express.static('upload_image'));

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());
app.use(csrfTokenMiddleware);

app.use(checkAuth);

app.use(baseRoute);
app.use(userRoute);
app.use('/article', protectRouteMiddleware ,articleRoute);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(port);
  })
  .catch(function (error) {
    console.log("與資料庫連結失敗");
    console.log(error);
  });
