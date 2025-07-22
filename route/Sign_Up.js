const express=require('express');
const UserRouter=express.Router();
const home=require('../controllers/home');
UserRouter.get('/Sign_Up',home.Sign_Up);
module.exports=UserRouter;