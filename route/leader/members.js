const express=require('express');
const UserRouter=express.Router();
const home = require('../../controllers/leader');
UserRouter.get('/leader/leader-members',home.members);
module.exports=UserRouter;