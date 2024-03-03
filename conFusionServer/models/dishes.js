// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// require("mongoose-currency").loadType(mongoose);
// const Currency = mongoose.Types.Currency;

// var commentSchema = new Schema({
//     ratting: {
//         type: Number,
//         min: 1,
//         max: 5,
//         require: true
//     },
//     comment: {
//         type: String,
//         require: true
//     },
//     author: {
//         type: String,
//         require: true
//     }
// },{
//     timestamps: true
// });

// const dishSchema = new Schema(
//   {
//     name: {
//       type: String,
//       require: true,
//       unique: true,
//     },
//     description: {
//       type: String,
//       require: true,
//     },
//     Image: { type: String, require: true },
//     category: { type: String, require: true },
//     label: { type: String, default: '' },
//     price : { type: String, require: true,min: 0 },
//     featured : { type: Boolean, default:false },
//     comments:[commentSchema]

//   },
//   {
//     timestamps: true,
//   }
// );

// var Dishes = mongoose.model("Dish", dishSchema);
// module.exports = Dishes;


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


var dishSchema = new Schema(
    {
        name: {
          type: String,
          require: true,
          unique: true,
        },
        description: {
          type: String,
          require: true,
        },
        Image: { type: String, require: true },
        category: { type: String, require: true },
        label: { type: String, default: '' },
        price : { type: String, require: true,min: 0 },
        featured : { type: Boolean, default:false },
        comments:[commentSchema]
    
      },
      {
        timestamps: true,
      }
    );

var Dishes = mongoose.model('Dish', dishSchema);
module.exports = Dishes;