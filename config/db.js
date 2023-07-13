const mongoose=require('mongoose');
const colors=require('colors');

const connectdb= async()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Mongodb connected ${mongoose.connection.host}` .bgGreen.white)
  } catch (error) {
    console.log(`Mongodb server Issue ${error}` .bgRed.white);
  }
}

module.exports=connectdb;