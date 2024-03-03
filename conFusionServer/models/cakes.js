const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  topping: [
    {
      type: String,
      required: true
    }
  ]
});

const Cake = mongoose.model('Cake', cakeSchema);

module.exports = Cake;
