const express= require('express');

const router= express.Router();
const {jwtAuthMiddleware, generateToken}= require('../jwt');
const User= require('./../DB/Sign_up')

const Candidate= require('./../DB/Candidate');


const checkRole=async(userID)=>{
    try{
        const user= await User.findById({userID})
        if(user.role==='admin'){
            return true;
        }
    }catch(err){
        return false;
    }
    
}

router.post("/",jwtAuthMiddleware,async(req,resp)=>{
    try{
        if(!(await checkRole(req.user.id))){
            resp.status(401).json({message:"user does not have a admin role"})
        }

        const data=req.body;
        const newCandidate= await Candidate(data)

        const result= await newCandidate.save();
        console.log("Data Saved");
        resp.status(200).json({message:result})


    }catch(err){
        resp.status(400).json({message:"User does not saved"})
    }
})



module.exports= router;