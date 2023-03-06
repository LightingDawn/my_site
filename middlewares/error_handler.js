function errorHandlerMiddleware(error, req, res, next) {
  console.log(error);

  const errorCode = error.code;
  if (errorCode === 404) {
    return res.status(404).render('shared/404');
  }
  
  res.status(500).render('shared/500');
}

module.exports = errorHandlerMiddleware;