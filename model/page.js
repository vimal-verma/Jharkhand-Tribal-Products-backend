const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  descripition: {
    type: String,
    default: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
  },  
  button: {
    type: String,
    default: 'Order your service now'
  },
  videourl: {
    type: String,
    default: 'https://vdev.in/static/media/user.c647c201.png'
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