const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique : true,
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
  }
  
}, { timestamps: true });

const Page = mongoose.model('Page', PageSchema);
module.exports = Page;