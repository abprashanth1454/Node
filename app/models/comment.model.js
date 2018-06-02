const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const comment = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Tweet' },
  message: { type: Schema.Types.ObjectId, ref: 'User' },
  data: {type: String},
  
});

mongoose.model('Comment', comment);