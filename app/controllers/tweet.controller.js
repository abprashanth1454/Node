const mongoose = require('mongoose');
const express = require('express');

const routes = express.Router();
const tweetModel = mongoose.model('Tweet');

module.exports.tweetController = function(app) {
  routes.get('/all', (req, res) => {
    tweetModel.find({}, (err, result) => {
      if(err) {
        return res.send('Some error occured');
      } 
      return res.send(result);
    })
  });
  routes.get('/tweet/:id', (req, res) => {
    let id = req.params['id'];
    tweetModel.findOne({'_id': id}, (err, result) => {
      if (err) {
        console.log(err);
        return res.send('Someting Went wrong');
      }
      if(result) {
        return res.send(result);
      } 
      return res.send('No Data Found');
    });
  });


  routes.put('/tweet/:id', (req, res) => {
    let id = req.params['id'];
    let newMessage = req.body.message;
    let obj = {
      message: newMessage,
      userName: 'Lalit'
    };
    tweetModel.findOneAndUpdate({'_id': id}, {$set: obj}, (err, result) => {
      if (err) {
        console.log(err);
        return res.send('Someting Went wrong');
      }
      if(result) {
        return res.send(result);
      } 
      return res.send('No Data Found');
    })

  });

  routes.delete('/delete/:id', (req, res) => {
    let id = req.params['id'];
    tweetModel.findOneAndDelete({'_id': id}, (err, result) => {
      if (err) {
        console.log(err);
        return res.send('Someting Went wrong');
      }
      if(result) {
        return res.send(result);
      } 
      return res.send('No Data Found');
    })
  });

  routes.post('/add', (req, res) => {
    let name = req.body.name;
    let userId = req.body.userId;
    let userObj = {
      name: name,
      userId: userId
    }
    let message = req.body.message;
    let tweet = new tweetModel({
      user: userObj,
      message: message
    });
    tweet.save((err, result) =>{
      if(err) {
        return res.send('Some error occured');
      }
      res.send(result);
    })
  });
  app.use('/tweet/v1', routes);
}