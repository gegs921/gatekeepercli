require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const saltRounds = 10;
const dbuname = process.env.DB_UNAME;
const dbpassword = process.env.DB_PASSWORD;
const handleEditPost = require('./util/editPromise');

const app = express();
const port = process.env.PORT;

let db = mongoose.connect(`mongodb://${dbuname}:${dbpassword}@ds137827.mlab.com:37827/ggcdb`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

const ClassSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true
  },
  connectedUserId: {
    type: String,
    required: true
  },
  scores: {
    type: Array,
    required: true
  },
  weights: {
    type: Array,
    required: true
  },
  deleted: {
    type: Boolean,
    required: true
  }
});

const Class = mongoose.model('Class', ClassSchema);
const User = mongoose.model('User', UserSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/register', (req, res) => {
  if(req.session.email) {
    res.send('You are already logged into your account.');
  }
  else {
    res.sendFile(path.join(__dirname + '/dist/register.html'));
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/login.html'));
});

app.get('/dashboard', (rea, res) => {
  res.sendFile(path.join(__dirname + '/dist/dashboard.html'));
})

app.get('/user', (req, res) => {
  User.findOne({ email: req.session.email }, function(err, user) {

    if(user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email
      });
    }
    else {
      res.json({});
    }
  })
});

app.get('/logout', function(req, res, next) {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});

app.get('/classes', (req, res) => {
  console.log(req.session.userId);
  if(!req.session.userId) {
    res.send('User must be logged in to view their saved classes.')
    return;
  }
  Class.find({ connectedUserId: req.session.userId }, function(err, classes) {
    if(err) {
      res.send('User has not saved any classes');
      return console.log(err);
    }
    else {
      res.send(classes);
      return;
    }
  });
});

app.post('/registrationComplete', (req, res) => { 
  let userData = {
    email : req.body.email,
    username: req.body.username,
    password: req.body.password
  };

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(userData.password, salt, function(err, hash) {
      userData.password = hash;
      let userModelInstance = new User(userData);

      userModelInstance.save((err, user) => {
        if(err) return console.error(err);
        else { 
          req.session.email = req.body.email;
          req.session.userId = user.id;
          res.redirect('/');
        }
      });
    })
  });
});

app.post('/loginComplete', (req, res) => {
  User.findOne({ email: req.body.email }, function(err, user) {
    if(err) {
      console.log(err);
      return;
    }
    if(!user) {
      res.send(false);
      return;
    }
    bcrypt.compare(req.body.password, user.password, function(err, result) {
      if(result === true) {
        console.log(req.session);
        req.session.email = req.body.email;
        req.session.userId = user.id;
        res.send(true);
      }
      else {
        res.send(false);
        return;
      }
    });
  });
});

app.post('/usernameandemailcheck', (req, res) => {
  User.find({ username: req.body.username, email: req.body.email }, function(err, user) {
    if(err) {
      console.log(err);
    }
    else if(!user) {
      res.send(true);
    }
    else {
      res.send(false);
    }
  });
});

app.post('/saveClass', (req, res) => {
  let classData = {
    className: req.body.className,
    connectedUserId: req.body.userId,
    scores: req.body.scores,
    weights: req.body.weights,
    deleted: req.body.deleted
  }
  let classModelInstance = new Class(classData);

  classModelInstance.save((err, user) => {
    if(err) {
      return console.log(err);
    }
    else {
      res.redirect('/');
    }
  });
});

app.post('/deleteClass', (req, res) => {
  Class.updateOne({ _id: req.body.id }, { 
      deleted: true 
    }, (err, updated) => {
      if(err) {
        console.log(err);
      }
    })
})

app.post('/classToEditPost', (req, res) => {
  let data = {
    scores: req.body.scores,
    weights: req.body.weights,
    className: req.body.className,
    id: req.body.id
  }

  res.send('done');

  app.get('/classToEdit', (req1, res1) => {
    res1.json(data);
  })
})

app.post('/editClass', (req, res) => {
  let newClassData = {
    className: req.body.className,
    scores: req.body.scores,
    weights: req.body.weights
  }

  Class.updateOne({ _id: req.body.id }, newClassData, (err, updated) => {
    if(err) {
      console.log(err);
      return;
    }
  })
})

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});