const path=require('path');
const rootDir=require('../Utils/path');
const express=require('express');
const UserRouter=express.Router();
const home=require('../controllers/home');
UserRouter.get('/leader_log',home.leader_log);
UserRouter.get('/leader',home.leader);

module.exports=UserRouter;