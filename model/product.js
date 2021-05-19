const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
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

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;