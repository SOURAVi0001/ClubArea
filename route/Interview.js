const express=require('express');
const UserRouter=express.Router();
const home=require('../controllers/home');
UserRouter.get('/interview',home.interview);
module.exports=UserRouter;