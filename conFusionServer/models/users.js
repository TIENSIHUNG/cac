var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        
    },
    password:  {
        type: String,
        required: true
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
