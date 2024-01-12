const errorResponserHandler = (err, req, res, next) => {
  //先獲得錯誤的狀態碼，如果沒有就設定為400
  const statusCode = err.statusCode || 400;
  //把錯誤訊息從err.message取出來
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

//create error handler for invalid path
 const invalidPathHandler = (req, res, next) => {
  let error = new Error("Invalid Path");
  error.statusCode = 404;
  next(error);
};
//錯誤示範喔
// module.exports = errorResponserHandler
// module.exports = invalidPathHandler

module.exports = {
  errorResponserHandler,
  invalidPathHandler
};
//這個會在server.js被引用