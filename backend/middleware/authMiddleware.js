const jsonwebtoken = require("jsonwebtoken");
const verify = jsonwebtoken.verify;
const User = require("../models/User");

//這邊就是驗證token的middleware（authGuard）
const authGuard = async (req, res, next) => {
  console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //從token中取出id
      const token = req.headers.authorization.split(" ")[1];
      const { id } = verify(token, process.env.JWT_SECRET);//比較token和secret
      console.log(token);
      console.log(id);
      //把user資料放到req.user中
      req.user = await User.findById(id).select("-password");//把user資料放到req.user中
      next();
    } catch (error) {
      //如果token過期或是不合法
      let err = new Error("Not authorized, Token failed");
      err.statusCode = 401;//unauthorized error
      next(err);
    }
  } else {
    let error = new Error("Not authorized, No token");
    error.statusCode = 401;
    next(error);
  }
};
//這邊就是驗證是否為管理員的middleware（adminGuard）
 const adminGuard = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    let error = new Error("Not authorized as an admn");
    error.statusCode = 401;
    next(error);
  }
};

module.exports = { authGuard, adminGuard };
