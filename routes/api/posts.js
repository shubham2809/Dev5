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

// @route   api/posts/like/:id
// @desc    Like Post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProfileModel.findOne({ user: req.user.id }).then(profile => {
      PostModel.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({alreadyliked: 'User already liked this post'});
          }
          //Add user id to likes array
          post.likes.unshift({user: req.user.id});

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

// @route   api/posts/unlike/:id
// @desc    unlike Post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProfileModel.findOne({ user: req.user.id }).then(profile => {
      PostModel.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({notliked: 'You have not liked this post'});
          }

          //Remove likes
          const filteredLikes = post.likes.filter(item => {
            return item.user.toString() !== req.user.id;
          });

          post.likes = filteredLikes;

          post.save().then(post => res.json(post));
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

/* Comments */

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', {session:false}),(req, res) => {

  const { errors, isValid } = validatePostInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  PostModel.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }
      post.comments.unshift(newComment);

      //save
      post.save().then(post => res.json(post));

    })
    .catch( err => res.status(404).json({postnotfound: 'No post found'}))
});

// @route   DELETE api/posts/comment/:id
// @desc    DELETE comment
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt',{session: false}), (req, res) => {
    PostModel.findById(req.params.id)
      .then(post => {
        //check to see if comments exist
        if( post.comments.filter(comment => comment.id.toString() === req.params.comment_id).length === 0) {
          return res.status(404).json({ commentnotexist: 'Comment does not exist'});
        }

        const filteredComments = post.comments.filter(item => {
          return item.id !== req.params.comment_id;
        });

        post.comments = filteredComments;

        post.save().then(post => res.json(post));

      })
      .catch(err => res.status(404).json({postnotfound: 'No Post Found'}))
})


module.exports = router;
