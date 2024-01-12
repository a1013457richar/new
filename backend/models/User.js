const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
//經過加密的密碼
const bcryptjs = require("bcryptjs");
const hash = bcryptjs.hash;
const compare = bcryptjs.compare;
const jsonwebtoken = require("jsonwebtoken");
const { userProfile } = require("../controllers/userControllers");
const sign = jsonwebtoken.sign;

const UserSchema = new Schema(
  {
    avatar: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    verified: { type: Boolean, default: false },
    // isGoogleAccount: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);
//這裡的this指向的事new user document
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    //如果密碼有被更改的話
    //返回的值是有經過加密的
    this.password = await hash(this.password, 10);
    return next();
  }
  return next();
});
//這裡用了jwt
UserSchema.methods.generateJWT = async function () {
  // 這個this指向的是user document
  return await sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",//在這裡設定token的過期時間
  });
};
//比較密碼，這裡的this指向的是user document
//只要return promise就可以用await
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const User = model("User", UserSchema);

module.exports = User;
