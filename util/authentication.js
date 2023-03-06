function createUserSession(req, user, action) {
  // 建立session中的uid儲存使用者的id
  req.session.uid = user._id.toString();
  // 確認使用者是否為管理者
  req.session.isAdmin = user.isAdmin;
  // 將上述的動作存檔
  req.session.save(action);
}

function destroyUserAuthSession(req) {
  // 當user登出時, 將認證設為null
  req.session.uid = null;
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession
};