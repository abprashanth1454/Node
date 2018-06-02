const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const routes = express.Router();
const userModel = mongoose.model('User');
const userService = require('../service/user.service');

module.exports.userController = function(app) {
  
  routes.get('/all', (req, res) => {
    userModel.find({}, (err, result) => {
      if (err) {
        return res.send('No record found' + err);
      }
      res.render('userprofile', {result});
    })
  });
  
  routes.get('/signup', (req, res) => {
    res.render('signup');
  });

  routes.post('/signup', (req, res) => {      
    userService.sigupHelper(req, res)
    .then((data, token) => {
      console.log(data, token);
      res.set({
        'Content-Type': 'application/json',
        'Content-Length': '123',
        'ETag': '12345',
        'Access-Control-Allow-Origin': '*',
        'X-Powered-By': '',
        'x-auth-token': data.token
      }).send(data.result);
    })
    .catch((err) => {
      return res.send('Error' + err);
    });
  });
  
  routes.get('/login', (req, res) => {
    res.render('login');
  });
  
  routes.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    userModel.findByCredential(email, password)
      .then((result) => {
        req.session.user = result;
        res.send('Success');
      })
      .catch((error) => {
        res.send(err);
      });
  });
  
  routes.get('/profile/:id', (req, res) => {
    let id = req.params['id'];
    userModel.findOne({'_id': id}, (err, result) => {
      if (err) {
        return res.send('Could not get your profile')
      }
      console.log(result);
      let userDetail = result;
      res.render('userprofile', {userDetail});
    })
  });

  routes.get('/update/:id', auth.authenticate, (req, res) => {
    let id = req.params['id'];
    req.user;
    userModel.findOne({'_id': id}, (err, result) => {
      if (err) {
        return res.send('Could not get your profile')
      }
      console.log(result);
      res.render('updateuser', {user: result});
    })
  });

  routes.post('/update/:id', (req, res) => {
    let id = req.params['id'];
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let username = req.body.username;
    let password = req.body.password;
    let body = {
      fname: fname,
      lname: lname,
      email: email,
      mobile: mobile,
      username: username,
      password: password
    }
    userModel.findOneAndUpdate({'_id': id}, body,  {runValidators: true}, (err, result) => {
      if(err) {
        return res.send('Could not update your profile')
      }
      console.log(result);
      res.redirect('/user/profile/' + id);
    })
  });

  routes.post('/profile/delete/:id', (req, res) => {
    let id = req.params['id'];
    userModel.findOneAndRemove({'_id':id}, (err, result) => {
      if (err) {
        return res.send('Could not delete your profile');
      }
      res.redirect('/user/all');
    });
  });

  routes.get('/', (req, res) => {
    res.send({'data':'Hello World'});
  });

  app.use('/user', routes);
}