const express= require('express');
const User= require('../DB/Sign_up');
const router= express.Router();

const {jwtAuthMiddleware, generateToken}= require('../jwt');



router.post('/signup',async(req,resp)=>{
    try{
        const data= req.body;
        const adminUser= await User.findOne({role:"admin"})
        if(data.role==='admin' && adminUser){
           return resp.status(400).json({message:"Admin user already exist"});
        }

        if(!/^\d{12}$/.test(data.aadhaar)){
           return resp.status(400).json({error: "Aadhar card number must be 12 digit number"})
        }
        
        const newUser= new User(data);
        

        const result = await newUser.save();
        
        console.log("Data Saved");

        const payload= {
            id: result.id
        }
        console.log(JSON.stringify(payload));
        const token= generateToken(payload);
        console.log("token generated:",token)

       return resp.status(200).json({result:result,token:token})
        
    }catch(error){
        console.log("error during signup:",error)
       return resp.status(401).json({error: "Internal server error"})
    }

    
});

router.post('/login',async(req,resp)=>{
    try{
        const {aadhaar, password}= req.body;
        if(!aadhaar || !password){
           return resp.status(400).json({error:"Aadhaar and password is required"})
        }

        const user= await User.findOne({aadhaar:"aadhaar"});
        if(!user || !await user.comparePassword(password)){
          return resp.status.json({error:"user does not exist"});
        }

        const payload={
            id: user.id
        }
       

        const token= generateToken(payload)

        return resp.json({token});

    }catch(error){
       return resp.status(500).json({error:"Internal Server Error"})
    }
});

router.get("/profile",jwtAuthMiddleware,async(req,resp)=>{
    try{
        const userData=req.user;
        const userId= userData.id;
        const user= await User.findById(userId)

       return resp.status(200).json({user});

    }catch(error){
        return resp.status(500).json({error:"Internal Error"});
    }
})

router.put("/profile/password",jwtAuthMiddleware,async(req,resp)=>{
        try{
            const userId= req.user.id;
            const {currPassword, newPassword}= req.body;

            if(!currPassword || !newPassword){
               return resp.status(400).json({error:"Both curr password and new password is mandateory"})
            }

            const user= await User.findById(userId);

            if(!user || !(await user.comparePassword(currPassword))){
               return resp.status(400).json({error:"Invalid Current password"});
            }

            user.password= newPassword;
                await user.save();
            console.log("Password Updated");
           return resp.status(200).json({message:"Pasword Updated"});


        }catch(error){
            console.log(error)
            return resp.status(400).json({error:"Password not updated"})
        }
})

module.exports= router;