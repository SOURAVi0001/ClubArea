const express=require('express');
const UserRouter=express.Router();
const home = require('../../controllers/leader');
UserRouter.get('/leader/leader-chat',home.chat);
module.exports=UserRouter;