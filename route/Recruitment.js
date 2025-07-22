const express=require('express');
const UserRouter=express.Router();
const home=require('../controllers/home');

UserRouter.get('/recruitment',home.recruitment);
module.exports=UserRouter;













