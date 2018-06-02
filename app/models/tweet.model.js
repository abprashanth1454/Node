const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tweet = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  message: {type: String},
  comments: [
      {
        user: {
          name: {type: String},
          userId: {type: Number}
        },
        message: {
          data: {type: String}
        }
      }
  ]
});

mongoose.model('Tweet', tweet);