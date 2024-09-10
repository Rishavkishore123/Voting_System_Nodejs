const mongoose= require('mongoose');
const Sign_up = require('./Sign_up');
const { jwtAuthMiddleware } = require('../jwt');
mongoose.connect('mongodb://127.0.0.1:27017/Voting')

const candidateSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    
    age:{
        type:Number,
        required:true
    },

    party:{
        type:String,
        required: true
    },

    votes:[
        {
            Sign_up:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },

            votedAt:{
                type: Date,
                required: Date.now
            },


        }
    ],

    countvote:{
        type: Number,
        default:0
   }
})



module.exports= mongoose.model("Candidate",candidateSchema);