// 獲取session資訊
function getSessionData(req) {
  // 獲取儲存在session中的資料
  const sessionData = req.session.flashedData;
  // 清空session
  req.session.flashedData = null;
  
  return sessionData;
}

function flashDataToSession(req, data, action) {
  // session儲存資料
  req.session.flashedData = data;
  // 將session儲存到資料庫
  req.session.save(action);
}

module.exports = {
  getSessionData: getSessionData,
  flashDataToSession: flashDataToSession
};