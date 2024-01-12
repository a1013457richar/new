const { uploadPicture } = require("../middleware/uploadPictureMiddleware");
const User = require("../models/User");
const { fileRemover } = require("../utils/fileRemover");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const config = process.env.JWT_SECRET;
const registerUser = async (req, res, next) => {
  try {
    if (req.body.googleAccessToken) {
      // 處理 Google 認證
      const { googleAccessToken } = req.body;

      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${googleAccessToken}` },
        }
      );

      const {
        given_name: firstName,
        family_name: lastName,
        email,
        picture,
      } = response.data;

      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exist!" });

      user = await User.create({
        verified: true,
        email,
        name: `${firstName} ${lastName}`,
        // profilePicture: picture, // 如果您想保存圖片
      });

      const token = jwt.sign({ email: user.email, id: user._id }, config, {
        expiresIn: "1h",
      });
      res.status(200).json({ user, token });
    } else {
      // 處理傳統註冊方式
      const { name, email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) throw new Error("User have already registered");

      user = await User.create({ name, email, password });

      const token = jwt.sign(
        { email: user.email, id: user._id },
        config,
        { expiresIn: "1h" }
      );
      res.status(201).json({ user, token });
    }
  } catch (error) {
    // 處理錯誤
    res.status(400).json({ message: error.message });
  }
};
//loginUser
const loginUser = async (req, res, next) => {
  try {
    if (req.body.googleAccessToken) {
      // Google OAuth 登入
      const { googleAccessToken } = req.body;
      const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${googleAccessToken}` },
      });

      const email = response.data.email;
      const existingUser = await User.findOne({ email });
      if (!existingUser) return res.status(404).json({ message: "User doesn't exist!" });

      const token = generateToken(existingUser); // 假設 generateToken 是一個共用函數
      res.status(201).json({ result: existingUser, token });

    } else {
      // 傳統電子郵件/密碼登入
      const { email, password } = req.body;
      console.log(email);
      const user = await User.findOne({ email });
      if (!user) throw new Error("Email not found");

      if (await user.comparePassword(password)) {
        const token = generateToken(user); // 使用相同的共用函數生成 token
        res.status(201).json({ result: user, token });
      } else {
        throw new Error("Invalid email or password");
      }
    }
  } catch (error) {
    next(error); // 統一錯誤處理
  }
};

// generateToken 函數的示例實現
function generateToken(user) {
  return jwt.sign({ email: user.email, id: user._id }, config, { expiresIn: "1h" });
}
// const loginUser = async (req, res, next) => {
//   try {
//     if (req.body.googleAccessToken) {
//       // Google OAuth 登入
//       const { googleAccessToken } = req.body;
//       const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
//         headers: { Authorization: `Bearer ${googleAccessToken}` },
//       });

//       const email = response.data.email;
//       const existingUser = await User.findOne({ email });
//       if (!existingUser) {
//         return res.status(404).json({ message: "User doesn't exist!" });
//       }

//       // 使用 generateToken 或 generateJWT 生成 token，根據您的實際實現
//       const token = existingUser.generateJWT ? await existingUser.generateJWT() : generateToken(existingUser);
//       res.status(200).json({ result: existingUser, token });

//     } else {
//       // 傳統電子郵件/密碼登入
//       const { email, password } = req.body;
//       const user = await User.findOne({ email });
//       if (!user) {
//         throw new Error("Email not found");
//       }

//       if (await user.comparePassword(password)) {
//         const token = user.generateJWT ? await user.generateJWT() : generateToken(user);
//         res.status(201).json({
//           _id: user._id,
//           avatar: user.avatar,
//           name: user.name,
//           email: user.email,
//           verified: user.verified,
//           admin: user.admin,
//           token: token,
//         });
//       } else {
//         throw new Error("Invalid email or password");
//       }
//     }
//   } catch (error) {
//     next(error); // 統一錯誤處理
//   }
// };



// const loginUser = async (req, res,next) => {
//   if (req.body.googleAccessToken) {
//     // gogole-auth
//     const { googleAccessToken } = req.body;

//     axios
//       .get("https://www.googleapis.com/oauth2/v3/userinfo", {
//         headers: {
//           Authorization: `Bearer ${googleAccessToken}`,
//         },
//       })
//       .then(async (response) => {
//         // const firstName = response.data.given_name;
//         // const lastName = response.data.family_name;
//         const email = response.data.email;
//         // const picture = response.data.picture;

//         const existingUser = await User.findOne({ email });
//         const token = jwt.sign(
//           {
//             email: existingUser.email,
//             id: existingUser._id,
//           },
//           config,
//           { expiresIn: "1h" }
//         );
//         if (!existingUser)
//           return res.status(404).json({ message: "User don't exist!" });

//         res.status(200).json({ result: existingUser, token });
//       })
//       .catch((err) => {
//         res.status(400).json({ message: "Invalid access token!" });
//       });
//   } else {
//     // const { email, password } = req.body;
//     try {
//       //從req.body中取出email,password
//       const { email, password } = req.body;

//       let user = await User.findOne({ email });

//       if (!user) {
//         throw new Error("Email not found");
//       }
//       //會回傳true或false
//       if (await user.generateToken(password)) {
//         return res.status(201).json({
//           _id: user._id,
//           avatar: user.avatar,
//           name: user.name,
//           email: user.email,
//           verified: user.verified,
//           admin: user.admin,
//           token: await user.generateJWT(),
//         });
//       } else {
//         throw new Error("Invalid email or password");
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
// };

const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (user) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
      });
    } else {
      let error = new Error("User not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
//updateProfile
const updateProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    //先比較有沒有這個user
    if (!user) {
      throw new Error("User not found");
    }
    //如果有這個user，就更新
    //從req.body中取出name,email,password，如果沒有就用原本的
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password && req.body.password.length < 6) {
      throw new Error("Password length must be at least 6 character");
    } else if (req.body.password) {
      user.password = req.body.password;
    }
    //儲存更新後的user
    const updatedUserProfile = await user.save();
    //回傳更新後的user
    res.json({
      _id: updatedUserProfile._id,
      avatar: updatedUserProfile.avatar,
      name: updatedUserProfile.name,
      email: updatedUserProfile.email,
      verified: updatedUserProfile.verified,
      admin: updatedUserProfile.admin,
      token: await updatedUserProfile.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};
//updateProfilePicture
const updateProfilePicture = async (req, res, next) => {
  try {
    //multer middleware
    //只能上傳一張圖片
    const upload = uploadPicture.single("profilePicture");

    upload(req, res, async function (err) {
      if (err) {
        // An unknown error occurred when uploading.
        const error = new Error(
          "An unknown error occured when uploading " + err.message
        );
        next(error);
      } else {
        // every thing went well
        if (req.file) {
          //這邊找到user，然後把舊的圖片刪掉，再把新的圖片存進去
          //updated user
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          if (filename) {
            //如果有存在舊的圖片，就刪掉，作為更新圖片的方式
            fileRemover(filename);
          }
          updatedUser.avatar = req.file.filename;
          //存進新的圖片
          await updatedUser.save();
          //正確的回傳格式
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        }
        //如果沒有上傳圖片
        else {
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          updatedUser.avatar = "";

          await updatedUser.save();
          //這裡用到了utils/fileRemover.js
          fileRemover(filename);
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
};
