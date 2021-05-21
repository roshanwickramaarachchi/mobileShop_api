const mongoose = require('mongoose');

const PhoneSchema = new mongoose.Schema({
  price: {
    type: String,
    required: [true, 'Please add a price'],
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
  },
  model: {
    type: String,
    required: [true, 'Please add a model'],
  },
  // edition: {
  //   type: String,
  //   required: [true, 'Please add a edition'],
  // },
  features: {
    type: String,
    required: [true, 'Please add a features'],
  },
  image: {
    type: String,
    required: [true, 'Please add a image'],
  },  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // My- this section indicate, shop id in when search Phones
  shop: {
    type: mongoose.Schema.ObjectId,
    ref: 'Shop',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },

});

module.exports = mongoose.model('Phone', PhoneSchema);
