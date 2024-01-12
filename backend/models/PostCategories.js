
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const PostCategoriesSchema = new Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const PostCategories = model("PostCategories", PostCategoriesSchema);
module.exports= PostCategories;
