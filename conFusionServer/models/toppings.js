const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toppingSchema = new Schema({
    type: {
        type: String,
        required: true,
        unique: true
    },
    price_extra: {
        type: Number,
        required: true
    }
    }
, {
    timestamps: true
});

var Topping = mongoose.model('Topping', toppingSchema);

module.exports = Topping;
