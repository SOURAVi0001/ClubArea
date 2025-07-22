const express=require('express');
const UserRouter=express.Router();
const home=require('../controllers/home');
UserRouter.post('/VALIDATE',home.VALIDATE);
module.exports=UserRouter;