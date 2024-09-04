const mongoose= require('mongoose');
const bcrypt= require('bcrypt');

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

   },
   age:{
    type: Number,
    required: true
   }

});

userSchema.pre('save',async function(next){
  const person=this;

  if(!person.isModified('password')) return next();

  try{
    const salt= await bcrypt.genSalt(10);

    const hashedPassword= await bcrypt.hash(person.password,salt);
    person.password=hashedPassword;
    next();

  }catch(error){
    return error;
  }
})


module.exports= mongoose.model("User",userSchema);