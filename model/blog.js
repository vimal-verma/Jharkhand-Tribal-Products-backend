const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  body: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
  },
  imgurl: {
    type: String,
  },
  category: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  },

}, { timestamps: true });

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;