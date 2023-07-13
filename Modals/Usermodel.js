const mongoose=require('mongoose');

const userschema=mongoose.Schema({
   name:{
    type:String,
    required:[true,'name is require'],
   },
   email:{
     type:String,
     required:[true,'email is required'],
   },
   password:{
    type:String,
    required:[true,'password is require'],
   }

});

const userModel=mongoose.model('users',userschema);

module.exports=userModel;