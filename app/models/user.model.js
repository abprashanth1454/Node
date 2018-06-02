const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtKey = require('../config/config');

const user = new Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: validator.isEmail,
		  message: '{VALUE} is not a valid email'
    }
  },
  mobile: {
    type: Number,
    required: false
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  token: [{
    access: {
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }]
});

user.statics.findByCredential = function(email, password) {
  const user = this;
  return new Promise((resolve, reject) => {
    user.findOne({email}).then((result) => {
      if (!result) {
        return reject('Error' + err);
      }
      return new Promise(function(resolve, reject) {
        bcrypt.compare(password, result.password, function(err, res) {
          if (res) {
             resolve(result);
          } else {
            reject('Error' + err);
          }
        });
      });
    });
  });
}

user.statics.createUser = function(data) {
  const user = this;
  let newUser = new user(data);
  return new Promise((resolve, reject) => {
    newUser.save((err, result) => {
      if (err) {
        reject('Error' + err);
      } else {
        let value = result.generateAuthToken().then((token) => {
          resolve({
            result: result,
            token: token
          });
        })
      }
    });
  });
}

user.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, jwtKey.getToken()).toString();
  user.token.push({
    access: access,
    token: token
  });
  return user.save().then((success) => {
    return token;
  });
}

user.statics.findByToken = function(token) {
  const users = this;
	let decoded;
	try {
    decoded = jwt.verify(token, jwtKey.getToken());
	} catch(e) {
    return Promise.reject(e);
	}
	return users.findOne({
		'_id': decoded._id,
		'token.token': token,
		'token.access': 'auth'
	});
}

user.pre('save', function(next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
      });
    })
  } else {
    next();
  }
});

mongoose.model('User', user);
