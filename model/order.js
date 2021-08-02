const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')
const Product = require('./product')

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
  product: [{
    type: Schema.Types.ObjectId,
    ref: Product,
    required: true,
  }],
  price: {
    type: Number,
    required: true,
  },
  currency_code: {
    type: String,
  },
  description: {
    type: String,
  },
  tras_id: {
    type: String,
    required: true,
  },
  create_time: {
    type: Date
  },
  email_address: {
    type: String,
  },
  status: {
    type: String,
  },
  id: {
    type: String,
  },

}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;