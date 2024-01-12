const express = require("express");
const router = express.Router();
const {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} = require("../controllers/commentControllers");
const { authGuard, adminGuard } = require("../middleware/authMiddleware");
router
  .route("/")
  .post(authGuard, createComment)
  .get(authGuard, adminGuard, getAllComments);
router
  .route("/:commentId")
  .put(authGuard, updateComment)
  .delete(authGuard, deleteComment);

module.exports = router;
