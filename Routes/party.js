const express= require('express');

const router= express.Router();

const Candidate= require('./../DB/Candidate');

router.post('/umeed',async(req,resp)=>{
    try{
        let result= new Candidate(req.body);
    let results= await result.save();
    results= results.toObject();
    resp.json(results);
    }
    catch(error){
        resp.status(401).json({error:"iNternal server error"});
    }
    
})

module.exports= router;