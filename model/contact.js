const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  budget: {
    type: String,
  }
}, { timestamps: true });

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;