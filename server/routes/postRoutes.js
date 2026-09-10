const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  createPost,
  getFeed,
  toggleLike,
  addComment,
} = require("../controllers/postController");

router.get("/post", auth, getFeed);

router.post("/post", auth, createPost);

router.post("/post/:id/like", auth, toggleLike);

router.post("/post/:id/comments", auth, addComment);

module.exports = router;