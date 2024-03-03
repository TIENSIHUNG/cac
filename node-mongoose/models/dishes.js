const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
    ratting: {
        type: Number,
        min: 1,
        max: 5,
        require: true
    },
    comment: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    }
},{
    timestamps: true
});




var dishSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },comments: [commentSchema]
},{
    timestamps: true
});

var Dishes = mongoose.model('Dish', dishSchema);
module.exports = Dishes;