const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique : true,
  },
  price: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
  },
  features: {
    type: Array,
  },
  description: {
    type: String,
  },
  imgurl: {
    type: String,
  }
  
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;