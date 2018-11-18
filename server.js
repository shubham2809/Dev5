const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');

// bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;

//Connect to BongoDB
mongoose
    .connect(db,{ useNewUrlParser: true })
    .then(() => console.log('Mongo DB Connected'))
    .catch(err => console.log(err));

// app.get('/', (req,res) => res.send('Hello World'));

// Use Passport
app.use(passport.initialize());
require('./config/passport')(passport); // Passport Config

//use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Running on ${port}`));
