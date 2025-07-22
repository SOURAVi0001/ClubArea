const express=require('express');
const UserRouter=express.Router();
const home = require('../../controllers/member');  
UserRouter.get('/member_leader_contact', home.Contact); 
module.exports=UserRouter;  









