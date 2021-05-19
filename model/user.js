const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  imgurl: {
    type: String,
  }
  
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;