function protectRoutes(req, res, next){
  if(!res.locals.isAuth) {
    return res.redirect('/401');
  }

  // if(req.path.startWith('/admin') && (!res.locals.isAdmin)) {
  //   return res.render('/403');
  // }

  next();
}

module.exports = protectRoutes;