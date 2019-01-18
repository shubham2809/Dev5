const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const PostModel = require("../../models/PostModel");
const validatePostInput = require("../../validation/post");
const ProfileModel = require("../../models/ProfileModel");

router.get("/test", (req, res) => res.json({ msg: "posts works" }));

// @route   api/posts
// @desc    Get Post
// @access  Public
router.get("/", (req, res) => {
  PostModel.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.status(404).json({ PostsNotFound: "There are no posts available" });
    });
});

// @route   api/posts/:id
// @desc    Get Single Post
// @access  Public
router.get("/:id", (req, res) => {
  PostModel.findById(req.params.id)
    .then(post => {
      res.json(post);
    })
    .catch(err => {
      res.status(404).json({ NoPostFound: "No Post found" });
    });
});

// @route   api/posts/:id
// @desc    Delete Single Post
// @access  Public
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProfileModel.findOne({ user: req.user.id }).then(profile => {
      PostModel.findById(req.params.id)
        .then(post => {
          //Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: "User not authorized" });
          }
          //Delete
          post.remove().then(() => {
            res.json({ success: "true" });
          });
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

// @route   api/posts
// @desc    Create Post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new PostModel({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => {
      res.json(post);
    });
  }
);

module.exports = router;
