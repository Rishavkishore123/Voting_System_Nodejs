const express= require('express');
const User= require('../DB/Sign_up');
const router= express.Router();

const {jwtAuthMiddleware, generateToken}= require('../jwt');



router.post('/signup',async(req,resp)=>{
    try{
        const data= req.body;
        const adminUser= await User.findOne({role:"admin"})
        if(data.role==='admin' && adminUser){
            resp.status(400).json({message:"Admin user already exist"});
        }

        if(!/^\d{12}$/.test(data.aadhaar)){
            resp.status(400).json({error: "Aadhar card number must be 12 digit number"})
        }
        
        const newUser= new User(data);

        const result = await newUser.save();
        console.log("Data Saved");

        const payload= {
            id: result.id
        }

        console.log(JSON.stringify(payload));
        const token= generateToken(payload);
        console.log(token)

        resp.status(200).json({result:result,token:token})
        
    }catch(error){
        resp.status(401).json({error: "Internal server error"})
    }
    
});

module.exports= router;