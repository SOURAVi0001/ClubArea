const express=require('express');
const UserRouter=express.Router();
const home = require('../controllers/home');
UserRouter.get('/user',home.user);
module.exports=UserRouter;