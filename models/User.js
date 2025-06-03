const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickname: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password:{
        type: String,
        require: true,  
    },
    avatar: {
        type: String,
        require: false,
    },
    points: {
        type:Number,
        default: 0,
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;