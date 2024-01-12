// // const router = require("express").Router();
// // const ex = require("express");

// const express = require('express');
// const router = express.Router();
// const passport = require("passport");

// router.get("/login/success", (req, res) => {
//   if (req.user) {
//     res.status(200).json({
//       error: false,
//       message: "user has successfully authenticated.",
//       user: req.user,
//     });
//   } else {
//     res.status(401).json({
//       success: false,
//       message: "user failed to authenticate.",
//     });
//   }
// });
// router.get("/login/failed", (req, res) => {
//   res.status(401).json({
//     success: false,
//     message: "user failed to authenticate.",
//   });
// });

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "http://localhost:3000",
//     failureRedirect: "/login/failed",
//     session: true,

//   })
// );

// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("http://localhost:3000");
// });

// module.exports = router;

