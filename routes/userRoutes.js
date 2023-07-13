const express=require('express');
const { loginController, registerController,authController } = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

//router object
const router=express.Router();

//login
router.post("/login",loginController);

//register
router.post("/register",registerController);

//Auth ||Post

router.post('/getUserData',authMiddleware,authController);


module.exports=router;