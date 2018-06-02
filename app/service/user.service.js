const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const userModel = mongoose.model('User');

module.exports.sigupHelper = function(req, res) {
  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let mobile = req.body.mobile;
  let username = req.body.username;
  let password = req.body.password;
  let user = {
    fname: fname,
    lname: lname,
    email: email,
    mobile: mobile,
    username: username,
    password: password
  };
  return userModel.createUser(user);
}
