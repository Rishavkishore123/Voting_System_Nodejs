const mongoose= require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Voting')

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

   email:{
    type:String,
   },

   aadhaar:{
    type: Number,
    required: true,
    unique: true
   },

   isVoted:{
    type:Boolean,
    default: false

   },

   address:{
    type:String,
    required: true
   },
   role:{
    type:String,
    enum:['voter','admin'],
    default: 'voter'

   }


});
module.exports= mongoose.model("User",userSchema);