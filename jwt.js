const jwt= require('jsonwebtoken');

const jwtAuthMiddleware= (req,resp,next)=>{
        const authorization= req.headers.authorization;
        if(!authorization) {
            resp.status(401).json({error:"token not found"})
        }

       const  token= req.headers.authorization.split('')[1];
       if(!token) resp.status(401).json({error:"Unauthorization person"});


       try{
        const decode= jwt.verify(token,process.env.JWT.secret_key)
        req.user=decode;
        next();
       }catch(error){
        resp.status(401).json({error:"Invalid Token"})
       }
}

const generateToken=(userData)=>{
    return jwt.sign(userData,process.env.JWT.secret_key,{expiresIn:'1h'});
}

module.exports={jwtAuthMiddleware, generateToken};