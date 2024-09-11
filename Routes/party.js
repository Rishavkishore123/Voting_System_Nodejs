const express= require('express');

const router= express.Router();
const {jwtAuthMiddleware,generateToken}= require('../jwt');
const User= require('./../DB/Sign_up')

const Candidate= require('./../DB/Candidate');


const checkRole=async(userID)=>{
    try{
        const user= await User.findById({userID})
        if(user.role ==='admin'){
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
        resp.status(404).json({message:"User does not saved"})
    }
})

router.put("/:candidateID",jwtAuthMiddleware,async(req,resp)=>{
    try{
        if(!(await checkRole(req.user.id))){
            resp.status(401).json({message:"user does not have a admin role"})
        }

        const candidateID=req.params.candidateID;
        const updateData= req.body;

        const result= await Candidate.findByIdAndUpdate(candidateID, updateData,{
            new:true,
            runValidators:true
        });

        if(!result){
            resp.status(401).json({message:"Internal server error"})
        }

        console.log("Data saved");
        resp.status(200).json(result)

    }catch(err){
        resp.status(404).json({message:"candidate not found"})
    }
})


module.exports= router;