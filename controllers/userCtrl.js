const userModel=require('../Modals/Usermodel');
const bcrypt=require('bcryptjs');

const jwt=require('jsonwebtoken');
const nodemailer = require("nodemailer");

const sendMail = async (email,name,id)=>{
     var transporter= nodemailer.createTransport({
      host:"smtp.gmail.com",
      secure:false,
      requireTLS:true,
      auth:{
        user:process.env.userMail,
        pass:process.env.mailpassword,
      }

     });
  
     const mailOptions ={
          from:process.env.userMail,
          to:email,
          subject:"varification mail",
          html:`<p> This is varification mail to ${name}</p>`,
     };
     transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
   });
 }

const registerController= async (req,resp)=>{
    
    console.log(req.body);
    try {
        //check for existing user
         const existinguser=await userModel.findOne({email:req.body.email});
         if(existinguser){
            return resp.status(200).send({message:'user Already Exist' ,sucess:false})
         }
         const password=req.body.password;
         console.log(password,req.body.name);
         // we encrypt the password for security
         const salt=await bcrypt.genSalt(10);
         //greater the gensalt value more time it take
         const hashedPassword=await bcrypt.hash(password,salt);
         req.body.password=hashedPassword;
         console.log(hashedPassword);

         // now saving in database with hashed password
         const newUser=new userModel();
         newUser.name=req.body.name;
         newUser.email=req.body.email;
         newUser.password=req.body.password;
        //  console.log(newUser);
         const result=await newUser.save();
         if(result){

          sendMail(req.body.email,req.body.name,result._id);
         }
        //  resp.send(result);
         resp.status(201).send({message:'Register Sucessfully',sucess:true});
    }
     catch (error) {
        console.log(error);
        resp.status(500).send({sucess:false,message:`Register controller ${error.message}`})
    }
}

//login handeler
const loginController=async(req,resp)=>{
  try {
    const user=await userModel.findOne({email:req.body.email});
    if(!user){
        return resp.status(200).send({message:'user not found',sucess:false})
    }
    //now check for the password
    const isMatch=await bcrypt.compare(req.body.password,user.password);
    if(!isMatch){
        return resp.status(200).send({message:'Invalid Email or Password' ,sucess:false});
    }
// we create token to make more secure the application 
//we set that the user login expire in 1day and user have to login once again on the website
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})
    resp.status(200).send({message:"Login Sucess",sucess:true,token});

  } catch (error) {
    console.log(error);
    resp.status(500).send({message:`Error in the login CTRL ${error.message}`})
  }
}

const authController=async(req,res)=>{
  try {
    const user=await userModel.findOne({_id:req.body.userId});
    if(!user){
      return res.status(200).send({
       message:"User not found",
       sucess:false,
      })
    }else{
      res.status(200).send({
        sucess:true,
        data:{
          name:user.name,
          email:user.email,
        },
      });
    }
    
  } catch (error) {
    res.status(500).send({
      message:"Auth error",
      sucess:false,
      error
    })
  }
}

module.exports={loginController,registerController,authController};