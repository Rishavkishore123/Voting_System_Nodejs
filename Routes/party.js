const express= require ('express');

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
          return resp.status(401).json({message:"user does not have a admin role"})
        }

        const data=req.body;
        const newCandidate= await Candidate(data)

        const result= await newCandidate.save();
        console.log("Data Saved");
       return resp.status(200).json({message:result})


    }catch(err){
       return resp.status(404).json({message:"User does not saved"})
    }
})

router.put("/:candidateID",jwtAuthMiddleware,async(req,resp)=>{
    try{
        if(!(await checkRole(req.user.id))){
           return resp.status(401).json({message:"user does not have a admin role"})
        }

        const candidateID=req.params.candidateID;
        const updateData= req.body;

        const result= await Candidate.findByIdAndUpdate(candidateID, updateData,{
            new:true,
            runValidators:true
        });

        if(!result){
           return resp.status(401).json({message:"Internal server error"})
        }

        console.log("Data saved");
       return resp.status(200).json(result)

    }catch(err){
        return resp.status(404).json({message:"candidate not found"})
    }
});

//delete the candidate 

router.delete("/:candidateID",jwtAuthMiddleware,async(req,resp)=>{

   try{
    if(!(await checkRole(req.user.id))){
        resp.status(401).json({message:"User does not have a admin role"})
    }
    const candidateID= req.params.candidateID
    const result= await Candidate.findByIdAndDelete(candidateID)

    if(!result){
        return resp.status(401).json({message:"Cannot find the candidateID"})
    }

    console.log("Data Deleted")

    return resp.status(200).json(result)

   }catch(err){
    return resp.status(401).json({message:"Internal Server Error"})
   }
})

// ---->>> there by I have to posting the photo

//lets start voting

router.post('/vote/:candidateID',jwtAuthMiddleware,async(req,resp)=>{


        const candidateID=req.params.candidateID;
        const userID= req.user.id;
    try{
        const candidate= await Candidate.findById(candidateID)

        if(!candidate){
           return resp.status(404).json({message:"Candidate not found"})
        }

        if(candidate.role==='admin'){
            return resp.status(404).json({message:"Candidate are not allowed to vote"})
         }
 
        const user= await User.findById(userID)
        if(!user){
           return resp.status(404).json({message:"User not found"})
        }
        if(user.role==='admin'){
            return resp.status(400).json({message:"Candidate are not allowed to vote"})
        }

        if(user.isVoted){
            return resp.status(400).json({message:"User are already voted"})
        }

        candidate.votes.push({user: userID, votedAt: new Date()})
        candidate.countvote++;
        await candidate.save();

        user.isVoted=true;
        await user.save();
        return resp.status(200).json({message:"vote recorded successfully"})
        
    }catch(err){
       return resp.status(500).json({message:"Internal Server Error",error:err.message})
    }
})

//how to get the candidate list
router.get("/",async(req,resp)=>{
    try{
        const candidate= await Candidate.find({},'name party-_id')
    }catch(error){
        resp.status(500).json({message:"Internal Server Error"})
    }
})


module.exports= router;