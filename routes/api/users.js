const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load user model
const User = require('../../models/User');


// @route   GET api/users/test
// @desc    Tests users route
// @access  Public

router.get('/test', (req, res) => res.json({
    msg: "Users works"
}));

// @route   GET api/users/resgister
// @desc    Tests users route
// @access  Public

router.post('/register', (req, res) => {
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    email: 'Email Already Exist'
                });
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar,
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});


// @route   GET api/users/login
// @desc    Login users route / Return JWT token
// @access  Public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;


    //Find the user by email
    User.findOne({
            email
        })
        .then(user => {
            if (!user) {
                res.status(404).json({
                    email: 'User not found'
                });
            }
            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //User match
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        } //Create JWT token

                        //Sign Token
                        jwt.sign(
                            payload,
                            keys.secretKey, {
                                expiresIn: 3600
                            },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            });
                    } else {
                        res.status(400).json({
                            password: 'password incorrect'
                        });
                    }
                });
        });
});



// @route   GET api/users/current
// @desc    Return current user
// @access  Public

router.get( '/current', 
    passport.authenticate('jwt', { session: false }), 
    (req, res) => { 
        res.json(req.user);
});


module.exports = router;
