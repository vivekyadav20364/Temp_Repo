const JWT=require('jsonwebtoken');

//now we create middle ware function same function but here we add net in the parameter 
//next excute the code further
//token related data stored in the req ke header me .. and from related data stored in the req ke body me ..


module.exports=async (req,res,next)=>{
 try{
   const token=req.headers['authorization'].split(" ")[1];
    
   //why we use split because token in the form of 
   //  Bearer fnjnjnfjnierufnefnejf
   // so we get the token at 2nd position
   JWT.verify(token,process.env.JWT_SECRET,(err,decode)=>{
    if(err){
        return res.status(200).send({
            message:'Auth failed',
            sucess:false
        })
    }
    else{
        req.body.userId=decode.id
        next();
    }
   })
    }catch(error){
        console.log(error);
        res.status(401).send({
            message:"Auth Failed",
            sucess:false,
        })
    }
}
