const User = require("../models/user.model");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");
const authentication = require("../util/authentication");
const xss = require('xss');

function signup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      username: "",
      nickname: "",
      email: "",
      confirmEmail: "",
      password: "",
    };
  }

  if (res.locals.isAuth) {
    return res.redirect('/');
  }
  
  res.render("users/auth/signup", { inputData: sessionData });
}

async function userSign(req, res) {
  const enteredData = {
    username: req.body.username,
    nickname: xss(req.body.nickname),
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
  };

  // 檢查欄位是否有輸入錯誤
  if (
    !validation.userDetailsAreValid(
      req.body.username,
      req.body.nickname,
      req.body.email,
      req.body.password
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "欄位輸入錯誤, 請檢查密碼是否6個字元以上, 信箱是否相符",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.username,
    req.body.nickname,
    req.body.email,
    req.body["confirm-email"],
    req.body.password
  );

  // 檢查暱稱是否有重複
  const nicknameFilter = await user.nicknameAlreadyUse();

  if (nicknameFilter) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "該暱稱已被註冊過, 請重新命名",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  // 檢查信箱是否註冊過
  const existingUser = await user.userAlreadyExist();

  if (existingUser) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "該信箱已被註冊過, 請用另一個信箱註冊或前往登入頁面",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  user.save();

  res.redirect("/");
}

function login(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  if(res.locals.isAuth) {
    return res.redirect('/');
  }
  res.render("users/auth/login", { inputData: sessionData });
}

async function userLogin(req, res) {
  const enteredData = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = new User("", "", req.body.email, "", req.body.password);

  // 確認資料庫中是否有符合資料的使用者
  const userExist = await user.userAlreadyExist();

  if (!userExist) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "請確認資料輸入是否正確",
        ...enteredData,
      },
      function () {
        res.redirect("/login");
      }
    );
    return;
  }

  const isSamePassword = await user.comparePassword(userExist.password);

  if (!isSamePassword) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "請確認資料輸入是否正確",
        ...enteredData,
      },
      function () {
        res.redirect("/login");
      }
    );
    return;
  }

  authentication.createUserSession(req, userExist, function () {
    res.redirect("/");
  });
}

function userLogout(req, res) {
  authentication.destroyUserAuthSession(req);

  res.redirect('/');
}

module.exports = {
  signup: signup,
  userSign: userSign,
  login: login,
  userLogin: userLogin,
  userLogout: userLogout
};
